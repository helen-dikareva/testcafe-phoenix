import path from 'path';
import { readSync as read } from 'read-file-relative';
import Promise from 'pinkie';
import Mustache from 'mustache';
import { Session } from 'testcafe-hammerhead';
import TestRunDebugLog from './debug-log';
import TestRunErrorFormattableAdapter from '../errors/test-run/formattable-adapter';
import { PageLoadError } from '../errors/test-run/';
import BrowserManipulationManager from './browser-manipulation-manager';
import CLIENT_MESSAGES from './client-messages';
import STATE from './state';
import COMMAND_TYPE from './commands/type';
import { ExpectedDialog } from './browser-dialogs';

import { TakeScreenshotOnFailCommand } from './commands/window-manipulation';

import {
    TestDoneCommand,
    PrepareBrowserManipulationCommand
} from './commands/service';

import {
    isCommandRejectableByPageError,
    isBrowserManipulationCommand,
    isServiceCommand,
    isHandleDialogCommand,
    isObservationCommand
} from './commands/utils';

//Const
const TEST_RUN_TEMPLATE               = read('../client/test-run/index.js.mustache');
const IFRAME_TEST_RUN_TEMPLATE        = read('../client/test-run/iframe.js.mustache');
const TEST_DONE_CONFIRMATION_RESPONSE = 'test-done-confirmation';
const MAX_RESPONSE_DELAY              = 2 * 60 * 1000;


var nextTick = () => new Promise(resolve => setTimeout(resolve, 0));


export default class TestRun extends Session {
    constructor (test, browserConnection, screenshotCapturer, opts) {
        var uploadsRoot = path.dirname(test.fixture.path);

        super(uploadsRoot);

        this.opts                       = opts;
        this.test                       = test;
        this.browserConnection          = browserConnection;
        this.browserManipulationManager = new BrowserManipulationManager(screenshotCapturer);

        this.running         = false;
        this.runningInIframe = false;
        this.state           = STATE.initial;

        this.driverTaskQueue            = [];
        this.browserManipulationQueue   = [];
        this.inCommandExecutionOnServer = false;
        this.testDoneCommandQueued      = false;
        this.initialDialogs             = [];

        this.pendingRequest   = null;
        this.pendingPageError = null;

        this.debugLog = new TestRunDebugLog(this.browserConnection.userAgent);

        this.injectable.scripts.push('/testcafe-core.js');
        this.injectable.scripts.push('/testcafe-ui.js');
        this.injectable.scripts.push('/testcafe-runner.js');
        this.injectable.scripts.push('/testcafe-driver.js');
        this.injectable.styles.push('/testcafe-ui-styles.css');

        this.errs                     = [];
        this.lastDriverStatusId       = null;
        this.lastDriverStatusResponse = null;

        this._start();
    }


    // Hammerhead payload
    _getPayloadScript () {
        var initialDialogs = this.running ? null : this.initialDialogs;

        //this.running = true;

        return Mustache.render(TEST_RUN_TEMPLATE, {
            testRunId:           this.id,
            browserHeartbeatUrl: this.browserConnection.heartbeatUrl,
            browserStatusUrl:    this.browserConnection.statusUrl,
            selectorTimeout:     this.opts.selectorTimeout,
            initialDialogs:      JSON.stringify(initialDialogs)
        });
    }

    _getIframePayloadScript () {
        var initialDialogs = this.runningInIframe ? null : this.initialDialogs;

        this.runningInIframe = true;

        return Mustache.render(IFRAME_TEST_RUN_TEMPLATE, {
            testRunId:       this.id,
            selectorTimeout: this.opts.selectorTimeout,
            initialDialogs:  JSON.stringify(initialDialogs)
        });
    }


    // Hammerhead handlers
    getAuthCredentials () {
        // TODO
    }

    handleFileDownload () {
        // TODO
    }

    handlePageError (ctx, err) {
        this.pendingPageError = new PageLoadError(err);

        ctx.redirect(ctx.toProxyUrl('about:error'));
    }


    // Test function execution
    async _executeTestFn (state, fn) {
        this.state = state;

        try {
            await fn(this);
        }
        catch (err) {
            var screenshotPath = null;

            if (this.opts.takeScreenshotsOnFails)
                screenshotPath = await this.executeCommand(new TakeScreenshotOnFailCommand());

            this._addError(err, screenshotPath);
            return false;
        }

        return !this._addPendingPageErrorIfAny();
    }

    async _start () {
        var beforeEachFn = this.test.fixture.beforeEachFn;
        var afterEachFn  = this.test.fixture.afterEachFn;

        TestRun.activeTestRuns[this.id] = this;

        this.emit('start');

        if (!beforeEachFn || await this._executeTestFn(STATE.inBeforeEach, beforeEachFn)) {
            await this._executeTestFn(STATE.inTest, this.test.fn);

            if (afterEachFn)
                await this._executeTestFn(STATE.inAfterEach, afterEachFn);
        }

        await this.executeCommand(new TestDoneCommand());
        this._addPendingPageErrorIfAny();

        delete TestRun.activeTestRuns[this.id];

        this.emit('done');
    }


    // Errors
    _addPendingPageErrorIfAny () {
        if (this.pendingPageError) {
            this._addError(this.pendingPageError);
            this.pendingPageError = null;
            return true;
        }

        return false;
    }

    _addError (err, screenshotPath) {
        var adapter = new TestRunErrorFormattableAdapter(err, {
            userAgent:      this.browserConnection.userAgent,
            screenshotPath: screenshotPath || '',
            testRunState:   this.state
        });

        this.errs.push(adapter);
    }


    // Task queue
    _getNextTaskCommand () {
        if (this.currentDriverTask) {
            if (this.currentDriverTask.executeOnServer) {
                this.currentDriverTask.executeOnServer();
                return null;
            }

            return this.currentDriverTask.command;
        }

        return null;
    }

    _getExecuteOnServerMethod (command) {
        return () => {
            this.inCommandExecutionOnServer = true;

            command
                .execute()
                .then(() => {
                    this._fulfillCurrentDriverTask({});
                    this.inCommandExecutionOnServer = false;

                    var nextCommand = this._getNextTaskCommand();

                    if (nextCommand && this.pendingRequest) {
                        nextTick()
                            .then(() => this._resolvePendingRequest(nextCommand));
                    }
                });
        };
    }

    _enqueueCommand (command, callsite) {
        var executeOnServer = null;

        if (command.type === COMMAND_TYPE.wait)
            executeOnServer = this._getExecuteOnServerMethod(command);

        if (this.pendingRequest && !this.inCommandExecutionOnServer) {
            if (executeOnServer)
                executeOnServer();
            else {
                nextTick()
                    .then(() => this._resolvePendingRequest(command));
            }
        }

        return new Promise((resolve, reject) => this.driverTaskQueue.push({
            command,
            resolve,
            reject,
            callsite,
            executeOnServer
        }));
    }

    _removeAllNonServiceTasks (success, result) {
        this.driverTaskQueue = this.driverTaskQueue.filter(driverTask => {
            var isService = isServiceCommand(driverTask.command);

            if (!isService) {
                if (success)
                    driverTask.resolve(result);
                else
                    driverTask.reject(result);
            }

            return isService;
        });

        this.browserManipulationQueue = this.browserManipulationQueue.filter(manipulationTask => isServiceCommand(manipulationTask.command));
    }

    // Current driver task
    get currentDriverTask () {
        return this.driverTaskQueue[0];
    }

    _resolveCurrentDriverTask (result) {
        this.currentDriverTask.resolve(result);
        this.driverTaskQueue.shift();

        if (this.testDoneCommandQueued)
            this._removeAllNonServiceTasks(true, result);
    }

    _rejectCurrentDriverTask (err) {
        err.callsite = err.callsite || this.driverTaskQueue[0].callsite;

        this.currentDriverTask.reject(err);
        this._removeAllNonServiceTasks(false, err);
    }


    // Pending request
    _clearPendingRequest () {
        if (this.pendingRequest) {
            clearTimeout(this.pendingRequest.responseTimeout);
            this.pendingRequest = null;
        }
    }

    _resolvePendingRequest (command) {
        this.lastDriverStatusResponse = command;
        this.pendingRequest.resolve(command);
        this._clearPendingRequest();
    }


    // Handle driver request
    _fulfillCurrentDriverTask (driverStatus) {
        if (driverStatus.executionError)
            this._rejectCurrentDriverTask(driverStatus.executionError);
        else
            this._resolveCurrentDriverTask(driverStatus.result);
    }

    _handlePageErrorStatus (pageError) {
        if (this.currentDriverTask && isCommandRejectableByPageError(this.currentDriverTask.command)) {
            this._rejectCurrentDriverTask(pageError);
            this.pendingPageError = null;

            return true;
        }

        this.pendingPageError = this.pendingPageError || pageError;

        return false;
    }

    _handleDriverRequest (driverStatus) {
        var pageError                  = this.pendingPageError || driverStatus.pageError;
        var currentTaskRejectedByError = pageError && this._handlePageErrorStatus(pageError);

        if (!currentTaskRejectedByError && driverStatus.isCommandResult) {
            if (this.currentDriverTask.command.type === COMMAND_TYPE.testDone) {
                this._resolveCurrentDriverTask();

                return TEST_DONE_CONFIRMATION_RESPONSE;
            }

            this._fulfillCurrentDriverTask(driverStatus);
        }

        return this._getNextTaskCommand();
    }

    // Execute command
    _enqueueHandleDialogCommand (handleDialogCommand) {
        var dialogType     = handleDialogCommand.type.replace(/handle|-/g, '');
        var dialog         = new ExpectedDialog(dialogType, handleDialogCommand.result);
        var length         = this.driverTaskQueue.length;
        var relatedCommand = null;
        var curCommand     = null;

        // NOTE: we should find command that causes appearance of native dialog to add information how to
        // handle this dialog. If no such commands we think that first page loading causes native dialog.
        // We save information about expected initial dialogs only before first page loading.
        for (var i = length - 1; i >= 0; i--) {
            curCommand = this.driverTaskQueue[i].command;

            if (!isHandleDialogCommand(curCommand) && !isObservationCommand(curCommand)) {
                relatedCommand = curCommand;
                break;
            }
        }

        if (relatedCommand)
            relatedCommand.expectedDialogs.push(dialog);
        else if (!this.running)
            this.initialDialogs.push(dialog);
    }

    executeCommand (command, callsite) {
        this.debugLog.command(command);

        if (this.pendingPageError && isCommandRejectableByPageError(command))
            return this._rejectCommandWithPageError(callsite);

        if (isBrowserManipulationCommand(command)) {
            this.browserManipulationQueue.push(command);

            return this.executeCommand(new PrepareBrowserManipulationCommand(command.type), callsite);
        }

        if (command.type === COMMAND_TYPE.testDone)
            this.testDoneCommandQueued = true;

        if (isHandleDialogCommand(command))
            this._enqueueHandleDialogCommand(command);

        return this._enqueueCommand(command, callsite);
    }

    _rejectCommandWithPageError (callsite) {
        var err = this.pendingPageError;

        err.callsite          = callsite;
        this.pendingPageError = null;

        return Promise.reject(err);
    }
}


// Active test runs pool, used by client functions
TestRun.activeTestRuns = {};


// Service message handlers
var ServiceMessages = TestRun.prototype;

ServiceMessages[CLIENT_MESSAGES.ready] = function (msg) {
    this.debugLog.driverMessage(msg);

    this._clearPendingRequest();

    // NOTE: the driver sends the status for the second time if it didn't get a response at the
    // first try. This is possible when the page was unloaded after the driver sent the status.
    if (msg.status.id === this.lastDriverStatusId)
        return this.lastDriverStatusResponse;

    this.lastDriverStatusId       = msg.status.id;
    this.lastDriverStatusResponse = this._handleDriverRequest(msg.status);

    if (this.lastDriverStatusResponse)
        return this.lastDriverStatusResponse;

    // NOTE: browsers abort an opened xhr request after a certain timeout (the actual duration depends on the browser).
    // To avoid this, we send an empty response after 2 minutes if we didn't get any command.
    var responseTimeout = setTimeout(() => this._resolvePendingRequest(null), MAX_RESPONSE_DELAY);

    return new Promise((resolve, reject) => this.pendingRequest = { resolve, reject, responseTimeout });
};

ServiceMessages[CLIENT_MESSAGES.readyForBrowserManipulation] = async function (msg) {
    this.debugLog.driverMessage(msg);

    var command = this.browserManipulationQueue.shift();

    if (command.type === COMMAND_TYPE.takeScreenshot)
        return await this.browserManipulationManager.takeScreenshot(this.id, command.path);

    if (command.type === COMMAND_TYPE.takeScreenshotOnFail)
        return await this.browserManipulationManager.takeScreenshotOnFail(this.id);

    if (command.type === COMMAND_TYPE.resizeWindow) {
        return await BrowserManipulationManager.resizeWindow(this.id, msg.currentWidth, msg.currentHeight,
            command.width, command.height);
    }

    if (command.type === COMMAND_TYPE.resizeWindowToFitDevice) {
        return await BrowserManipulationManager.resizeWindowToFitDevice(this.id, msg.currentWidth, msg.currentHeight,
            command.device, command.options.portraitOrientation);
    }
};
