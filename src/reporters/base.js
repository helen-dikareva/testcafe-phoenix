import tty from 'tty';
import chalk from 'chalk';
import wordwrap from 'wordwrap';
import indentString from 'indent-string';
import OS from '../utils/os';
import { find } from '../utils/array';

export default class BaseReporter {
    static DEFAULT_VIEWPORT_WIDTH = 78;

    constructor (task, outStream = process.stdout, formatter = null) {
        this.outStream = outStream;
        this.formatter = formatter;

        var isTTY = !!this.outStream.isTTY;

        this.style         = new chalk.constructor({ enabled: isTTY });
        this.viewportWidth = BaseReporter._getViewportWidth(isTTY);
        this.useWordWrap   = false;
        this.indent        = 0;

        this.passed      = 0;
        this.total       = task.tests.length;
        this.reportQueue = BaseReporter._createReportQueue(task);

        this.symbols = OS.win ?
                       { ok: '√', err: '×' } :
                       { ok: '✓', err: '✖' };

        this._assignTaskEventHandlers(task);
    }

    // Static
    static _getViewportWidth (isTTY) {
        if (isTTY && tty.isatty(1) && tty.isatty(2)) {
            return process.stdout.getWindowSize ?
                   process.stdout.getWindowSize(1)[0] :
                   tty.getWindowSize()[1];
        }

        return BaseReporter.DEFAULT_VIEWPORT_WIDTH;
    }

    static _createReportQueue (task) {
        var runsPerTest = task.browserConnections.length;

        return task.tests.map(test => BaseReporter._createReportItem(test, runsPerTest));
    }

    static _createReportItem (test, runsPerTest) {
        return {
            fixtureName: test.fixture.name,
            fixturePath: test.fixture.path,
            testName:    test.name,
            pendingRuns: runsPerTest,
            errMsgs:     [],
            unstable:    false,
            startTime:   null
        };
    }


    _getReportItemForTestRun (testRun) {
        var test = testRun.test;

        return find(this.reportQueue, i => i.fixturePath === test.fixture.path && i.testName === test.name);
    }

    _shiftReportQueue () {
        // NOTE: a completed report item is always at the front of the queue.
        // This happens because the next test can't be completed until the
        // previous one frees all browser connections.
        // Therefore, tests always get completed sequentially.
        var reportItem = this.reportQueue.shift();
        var durationMs = new Date() - reportItem.startTime;

        if (!reportItem.errMsgs.length)
            this.passed++;

        reportItem.errMsgs.sort();

        this._reportTestDone(reportItem.testName, reportItem.errMsgs, durationMs, reportItem.unstable);

        // NOTE: here we assume that tests are sorted by fixture.
        // Therefore, if the next report item has a different
        // fixture, we can report this fixture start.
        var nextReportItem = this.reportQueue[0];

        if (nextReportItem && nextReportItem.fixturePath !== reportItem.fixturePath)
            this._reportFixtureStart(nextReportItem.fixtureName, nextReportItem.fixturePath);
    }

    _assignTaskEventHandlers (task) {
        task.once('start', () => {
            var startTime  = new Date();
            var userAgents = task.browserConnections.map(bc => bc.userAgent);
            var first      = this.reportQueue[0];

            this._reportTaskStart(startTime, userAgents);
            this._reportFixtureStart(first.fixtureName, first.fixturePath);
        });

        task.on('test-run-start', (testRun) => {
            var reportItem = this._getReportItemForTestRun(testRun);

            if (!reportItem.startTime)
                reportItem.startTime = new Date();
        });

        task.on('test-run-done', (testRun) => {
            var reportItem = this._getReportItemForTestRun(testRun);
            var userAgent  = testRun.browserConnection.userAgent;

            var testRunErrMsgs  = testRun.errs.map(err => this.formatter(err, userAgent));

            reportItem.pendingRuns--;
            reportItem.errMsgs  = reportItem.errMsgs.concat(testRunErrMsgs);
            reportItem.unstable = reportItem.unstable || testRun.unstable;

            if (!reportItem.pendingRuns)
                this._shiftReportQueue();
        });

        task.once('done', () => {
            var endTime = new Date();

            this._reportTaskDone(this.passed, this.total, endTime);
        });
    }


    // Stream writing helpers
    _newline () {
        this.outStream.write('\n');

        return this;
    }

    _write (text) {
        if (this.useWordWrap)
            text = wordwrap(this.indent, this.viewportWidth)(text);
        else
            text = indentString(text, ' ', this.indent);

        this.outStream.write(text);

        return this;
    }

    _end (text) {
        if (text)
            this._write(text);

        if (this.outStream !== process.stdout)
            this.outStream.end('');
    }


    // Abstract methods
    /* eslint-disable no-unused-vars */

    _reportTaskStart (startTime, userAgents) {
        throw new Error('Not implemented');
    }

    _reportFixtureStart (name, path) {
        throw new Error('Not implemented');
    }

    _reportTestDone (name, errMsgs, durationMs, unstable) {
        throw new Error('Not implemented');
    }

    _reportTaskDone (passed, total, endTime) {
        throw new Error('Not implemented');
    }

    /* eslint-enable no-unused-vars */
}
