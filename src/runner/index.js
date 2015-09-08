import Promise from 'promise';
import { resolve as resolvePath } from 'path';
import Bootstrapper from './bootstrapper';
import Task from './task';
import LocalBrowserConnection from '../browser-connection/local';
import { concatFlattened } from '../utils/array';
import fallbackDefault from '../utils/fallback-default';

export default class Runner {
    constructor (proxy, browserConnectionGateway) {
        this.proxy        = proxy;
        this.bootstrapper = new Bootstrapper(browserConnectionGateway);

        this.opts = {
            screenshotPath:        null,
            takeScreenshotOnFails: false,
            failOnJsErrors:        true,
            quarantineMode:        false,
            reportOutStream:       null,
            formatter:             null
        };
    }

    // Static
    static _freeBrowserConnection (bc, errorHandler) {
        bc.removeListener('error', errorHandler);

        // NOTE: we should close local connections and
        // related browsers once we've done
        if (bc instanceof LocalBrowserConnection)
            bc.close();
    }

    // Run task
    _runTask (Reporter, browserConnections, tests) {
        return new Promise((resolve, reject) => {
            var task     = new Task(tests, browserConnections, this.proxy, this.opts);
            var reporter = new Reporter(task, this.opts.reportOutStream || void 0, this.opts.formatter || void 0);

            var bcErrorHandler = msg => {
                task.abort();
                task.removeAllListeners();
                browserConnections.forEach(bc => Runner._freeBrowserConnection(bc, bcErrorHandler));
                reject(new Error(msg));
            };

            browserConnections.forEach(bc => bc.once('error', bcErrorHandler));

            task.on('browser-job-done', job => Runner._freeBrowserConnection(job.browserConnection, bcErrorHandler));

            task.once('done', () => resolve(reporter.passed === reporter.total));
        });
    }


    // API
    src (...sources) {
        sources = concatFlattened([], sources).map(path => resolvePath(path));

        this.bootstrapper.sources = this.bootstrapper.sources.concat(sources);

        return this;
    }

    browsers (...browsers) {
        this.bootstrapper.browsers = concatFlattened(this.bootstrapper.browsers, browsers);

        return this;
    }

    reporter (reporter, outStream = null, formatter = null) {
        this.bootstrapper.reporter = reporter;
        this.opts.reportOutStream  = outStream;
        this.opts.formatter        = formatter;

        return this;
    }

    filter (filter) {
        this.bootstrapper.filter = filter;

        return this;
    }

    screenshots (path, takeOnFails = false) {
        this.opts.takeScreenshotOnFails  = takeOnFails;
        this.bootstrapper.screenshotPath = path;

        return this;
    }

    async run ({ failOnJsErrors, quarantineMode } = {}) {
        this.opts.failOnJsErrors = fallbackDefault(failOnJsErrors, true);
        this.opts.quarantineMode = fallbackDefault(quarantineMode, false);

        var { Reporter, browserConnections, tests } = await this.bootstrapper.createRunnableConfiguration();

        return await this._runTask(Reporter, browserConnections, tests);
    }
}
