import hammerhead from "../deps/hammerhead";
import { TYPE as DIALOG_TYPE } from "../../../test-run/browser-dialogs";


var messageSandbox = hammerhead.eventSandbox.message;


export default class DialogsMonitor {
    constructor (expectedDialogs) {
        this.expectedDialogs  = expectedDialogs || [];
        this.unexpectedDialog = null;

        this._init();
    }

    _handleDialog (type, text) {
        debugger;
        var expectedDialog = this.expectedDialogs.shift();

        if ((!expectedDialog || expectedDialog.type !== type) && !this.unexpectedDialog) {
            this.unexpectedDialog = type;
            
            messageSandbox.sendServiceMsg({
                type:       'unexpected-dialog',
                dialogType: type,
                text:       text
            }, window.top);

            return null;
        }

        messageSandbox.sendServiceMsg({
            type:       'actual-dialog',
            dialogType: type,
            text:       text
        }, window.top);

        return expectedDialog ? expectedDialog.result : null;
    }

    _init () {
        hammerhead.on(hammerhead.EVENTS.beforeUnload, e => {
            if (e.prevented && !e.isFakeIEEvent)
                this._handleDialog(DIALOG_TYPE.beforeUnload, e.returnValue.toString() || '');

            return null;
        });

        window.alert   = text => this._handleDialog(DIALOG_TYPE.alert, text);
        window.confirm = text => this._handleDialog(DIALOG_TYPE.confirm, text);
        window.prompt  = text => this._handleDialog(DIALOG_TYPE.prompt, text);
    }
}
