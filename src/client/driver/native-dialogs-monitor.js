import hammerhead from './deps/hammerhead';
import { waitFor } from './deps/testcafe-core';
import { EventEmitter } from '../core/utils/service';
import { UnexpectedDialogError, WasNotExpectedDialogError } from '../../errors/test-run';


var Promise = hammerhead.Promise;

const DEFAULT_DIALOGS_INFO     = {
    expectedDialogs: [],
    actualDialogs:   []
};
const CHECK_DIALOGS_DELAY      = 200;
const NATIVE_DIALOGS_INFO_FLAG = 'testcafe|native-dialogs-monitor|dialogs-info';

export default class NativeDialogsMonitor extends EventEmitter {
    constructor (contextStorage) {
        super();

        this.contextStorage               = contextStorage;
        this.unexpectedDialogErrorHandler = null;
    }

    _waitForExpectedDialogs (timeout) {
        debugger;
        var dialogWithError = this._checkExpectedDialogs();

        if (!dialogWithError)
            return Promise.resolve(null);

        return waitFor(() => {
            dialogWithError = this._checkExpectedDialogs();

            return dialogWithError ? false : true;
        }, CHECK_DIALOGS_DELAY, timeout)
            .then(() => null)
            .catch(() => new WasNotExpectedDialogError(dialogWithError));
    }

    _findDialog (type) {
        var dialogInfo = this.contextStorage.getItem(NATIVE_DIALOGS_INFO_FLAG) || DEFAULT_DIALOGS_INFO;

        for (var i = 0; i < dialogInfo.expectedDialogs.length; i++) {
            if (dialogInfo.expectedDialogs[i].type === type)
                return dialogInfo.expectedDialogs[i];
        }
    }

    _checkExpectedDialogs (type) {
        if (this._findDialog(type))
            return new WasNotExpectedDialogError(type);
    }

    init (initialDialogsInfo, errorHandler) {
        if (initialDialogsInfo && initialDialogsInfo.length)
            this.setExpectedDialogs(initialDialogsInfo);

        this.unexpectedDialogErrorHandler = errorHandler;

        hammerhead.on(hammerhead.EVENTS.beforeUnload, e => {
            if (!e.prevented || e.isFakeIEEvent)
                return;

            var dialogType     = 'beforeunload';
            var dialogsInfo    = this.contextStorage.getItem(NATIVE_DIALOGS_INFO_FLAG) || DEFAULT_DIALOGS_INFO;
            var expectedDialog = dialogsInfo.expectedDialogs.shift();
            var dialogText     = e.returnValue.toString() || '';

            if (dialogsInfo.unexpectedError)
                return;

            if (!expectedDialog || expectedDialog.type !== dialogType) {
                dialogsInfo.unexpectedError = true;
                this.unexpectedDialogErrorHandler(new UnexpectedDialogError(dialogType, dialogText));
            }

            dialogsInfo.actualDialogs.push({ type: dialogType, dialogText });
            this.contextStorage.setItem(NATIVE_DIALOGS_INFO_FLAG, dialogsInfo);
        });

        window.alert = text => {
            debugger;
            var dialogType     = 'alert';
            var dialogsInfo    = this.contextStorage.getItem(NATIVE_DIALOGS_INFO_FLAG) || DEFAULT_DIALOGS_INFO;
            var expectedDialog = dialogsInfo.expectedDialogs.shift();

            if (dialogsInfo.unexpectedError)
                return;

            if (!expectedDialog || expectedDialog.type !== dialogType) {
                dialogsInfo.unexpectedError = true;
                this.unexpectedDialogErrorHandler(new UnexpectedDialogError(dialogType, text));
            }

            dialogsInfo.actualDialogs.push({ type: dialogType, text });
            this.contextStorage.setItem(NATIVE_DIALOGS_INFO_FLAG, dialogsInfo);
        };

        window.confirm = text => {
            debugger;
            var dialogType     = 'confirm';
            var dialogsInfo    = this.contextStorage.getItem(NATIVE_DIALOGS_INFO_FLAG) || DEFAULT_DIALOGS_INFO;
            var expectedDialog = dialogsInfo.expectedDialogs.shift();

            if (dialogsInfo.unexpectedError)
                return false;

            if (!expectedDialog || expectedDialog.type !== dialogType) {
                dialogsInfo.unexpectedError = true;
                this.unexpectedDialogErrorHandler(new UnexpectedDialogError(dialogType, text));
            }

            dialogsInfo.actualDialogs.push({ type: dialogType, text });
            this.contextStorage.setItem(NATIVE_DIALOGS_INFO_FLAG, dialogsInfo);

            return expectedDialog ? expectedDialog.result : false;
        };

        window.prompt = text => {
            var dialogType     = 'prompt';
            var dialogsInfo    = this.contextStorage.getItem(NATIVE_DIALOGS_INFO_FLAG) || DEFAULT_DIALOGS_INFO;
            var expectedDialog = dialogsInfo.expectedDialogs.shift();

            if (dialogsInfo.unexpectedError)
                return null;

            if (!expectedDialog || expectedDialog.type !== dialogType) {
                dialogsInfo.unexpectedError = true;
                this.unexpectedDialogErrorHandler(new UnexpectedDialogError(dialogType, text));
            }

            dialogsInfo.actualDialogs.push({ type: dialogType, text });
            this.contextStorage.setItem(NATIVE_DIALOGS_INFO_FLAG, dialogsInfo);

            return expectedDialog ? expectedDialog.result : null;
        };
    }

    setExpectedDialogs (expectedDialogsInfo) {
        var dialogInfo = {
            expectedDialogs: expectedDialogsInfo || [],
            actualDialogs:   [],
            unexpectedError: false
        };

        this.contextStorage.setItem(NATIVE_DIALOGS_INFO_FLAG, dialogInfo);
    }

    checkDialogsErrors (type, timeout) {
        var dialogInfo = this.contextStorage.getItem(NATIVE_DIALOGS_INFO_FLAG);

        if (!dialogInfo)
            return timeout ? Promise.resolve(null) : null;


        return timeout ? this._waitForExpectedDialogs(timeout) : this._checkExpectedDialogs(type);
    }
}
