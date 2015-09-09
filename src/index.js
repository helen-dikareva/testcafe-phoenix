import { Proxy } from 'hammerhead';
import Mustache from 'mustache';
import BrowserConnectionGateway from './browser-connection/gateway';
import BrowserConnection from './browser-connection';
import Runner from './runner';
import read from './utils/read-file-relative';


// Const
const CORE_SCRIPT_TEMPLATE   = read('./client/templates/core.js.mustache');
const RUNNER_SCRIPT_TEMPLATE = read('./client/templates/runner.js.mustache');
const UI_SCRIPT_TEMPLATE     = read('./client/templates/ui.js.mustache');

const CORE_SCRIPT   = Mustache.render(CORE_SCRIPT_TEMPLATE, { source: read('./client/core/index.js') });
const RUNNER_SCRIPT = Mustache.render(RUNNER_SCRIPT_TEMPLATE, { source: read('./client/runner/index.js') });
const UI_SCRIPT     = Mustache.render(UI_SCRIPT_TEMPLATE, { source: read('./client/ui/index.js') });
const UI_STYLE      = read('./client/ui/styles.css');
const UI_SPRITE     = read('./client/ui/sprite.png', true);


// TestCafe
export default class TestCafe {
    constructor (port1, port2, hostname = '127.0.0.1') {
        this.proxy                    = new Proxy(hostname, port1, port2);
        this.browserConnectionGateway = new BrowserConnectionGateway(this.proxy);

        this._registerAssets();
    }

    _registerAssets () {
        this.proxy.GET('/testcafe-core.js', { content: CORE_SCRIPT, contentType: 'application/x-javascript' });
        this.proxy.GET('/testcafe-runner.js', { content: RUNNER_SCRIPT, contentType: 'application/x-javascript' });
        this.proxy.GET('/testcafe-ui.js', { content: UI_SCRIPT, contentType: 'application/x-javascript' });
        this.proxy.GET('/testcafe-ui-styles.css', { content: UI_STYLE, contentType: 'text/css' });
        this.proxy.GET('/testcafe-ui-sprite.png', { content: UI_SPRITE, contentType: 'image/png' });
    }


    // API
    createBrowserConnection () {
        return new BrowserConnection(this.browserConnectionGateway);
    }

    createRunner () {
        return new Runner(this.proxy, this.browserConnectionGateway);
    }

    close () {
        this.proxy.close();
    }
}
