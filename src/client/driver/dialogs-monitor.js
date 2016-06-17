import hammerhead from './deps/hammerhead';
import { waitFor } from './deps/testcafe-core';
import { TYPE as DIALOG_TYPE, AppearedDialog } from '../../test-run/browser-dialogs';


const CHECK_DIALOGS_DELAY = 200;

const EXPECTED_DIALOGS                = 'testcafe|dialogs-monitor|expected-dialogs';
const APPEARED_DIALOGS                = 'testcafe|dialogs-monitor|appeared-dialogs';
const UNEXPECTED_DIALOG               = 'testcafe|dialogs-monitor|unexpected-dialog';
const DEFAULT_WAIT_FOR_DIALOG_TIMEOUT = 10000;

export default class DialogsMonitor {
    constructor (contextStorage, expectedDialogs) {
        this.contextStorage = contextStorage;

        if (expectedDialogs)
            this.expectedDialogs = expectedDialogs;

        this._init();
    }

    get appearedDialogs () {
        var dialog = this.contextStorage.getItem(APPEARED_DIALOGS);

        if (!dialog) {
            dialog               = [];
            this.appearedDialogs = dialog;
        }

        return dialog;
    }

    set appearedDialogs (dialog) {
        this.contextStorage.setItem(APPEARED_DIALOGS, dialog);
    }

    get expectedDialogs () {
        var dialog = this.contextStorage.getItem(EXPECTED_DIALOGS);

        if (!dialog) {
            dialog               = [];
            this.expectedDialogs = dialog;
        }

        return dialog;
    }

    set expectedDialogs (dialog) {
        this.contextStorage.setItem(EXPECTED_DIALOGS, dialog);
    }

    get unexpectedAppearedDialog () {
        return this.contextStorage.getItem(UNEXPECTED_DIALOG);
    }

    set unexpectedAppearedDialog (dialog) {
        this.contextStorage.setItem(UNEXPECTED_DIALOG, dialog);
    }

    _handleDialog (type, text) {
        var dialog = new AppearedDialog(type, text);

        this.appearedDialogs.push(dialog);

        var expectedDialog = this.expectedDialogs.shift();

        if ((!expectedDialog || expectedDialog.type !== type) && !this.unexpectedAppearedDialog) {
            this.unexpectedAppearedDialog = dialog;
            return null;
        }

        return expectedDialog ? expectedDialog.result : null;
    }

    _init () {
        hammerhead.on(hammerhead.EVENTS.beforeUnload, e => {
            if (e.prevented && !e.isFakeIEEvent)
                this._handleDialog(DIALOG_TYPE.beforeUnload, e.returnValue.toString() || '');

            // NOTE: we should save changes which can me made via 'shift' and 'push' methods
            this.contextStorage.save();

            return null;
        });

        window.alert   = text => this._handleDialog(DIALOG_TYPE.alert, text);
        window.confirm = text => this._handleDialog(DIALOG_TYPE.confirm, text);
        window.prompt  = text => this._handleDialog(DIALOG_TYPE.prompt, text);
    }

    waitForDialog (timeout = DEFAULT_WAIT_FOR_DIALOG_TIMEOUT) {
        return waitFor(() => this.appearedDialogs.shift(), CHECK_DIALOGS_DELAY, timeout);
    }
}
