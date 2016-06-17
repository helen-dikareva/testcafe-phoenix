import { eventSandbox } from './deps/hammerhead';
import Driver from './driver';
import ContextStorage from './storage';
import DriverStatus from './status';
import ParentDriverLink from './driver-link/parent';
import { TYPE as MESSAGE_TYPE } from './driver-link/messages';
import DialogsMonitor from './dialogs-monitor/child';


export default class IframeDriver extends Driver {
    constructor (testRunId, selectorTimeout, initialDialogs) {
        super(testRunId, selectorTimeout);

        this.lastParentDriverMessageId = null;
        this.initialDialogs            = initialDialogs;
        this.parentDriverLink          = new ParentDriverLink(window.parent);
        this._initParentDriverListening();
    }

    // Errors handling
    _onJsError () {
        // NOTE: do nothing because hammerhead sends js error to the top window directly
    }

    // Messaging between drivers
    _initParentDriverListening () {
        eventSandbox.message.on(eventSandbox.message.SERVICE_MSG_RECEIVED_EVENT, e => {
            var msg = e.message;

            if (this.beforeUnloadRaised)
                return;

            // NOTE: the parent driver repeats commands sent to a child driver if it doesn't get a confirmation
            // from the child in time. However, confirmations sent by child drivers may be delayed when the browser
            // is heavily loaded. That's why the child driver should ignore repeated messages from its parent.
            if (msg.type === MESSAGE_TYPE.executeCommand) {
                if (this.lastParentDriverMessageId === msg.id)
                    return;

                this.lastParentDriverMessageId = msg.id;

                this.parentDriverLink.confirmMessageReceived(msg.id);
                this._onCommand(msg.command);
            }

            if (msg.type === 'blah') {
                debugger;
                if (this.dialogsMonitor)
                    this.dialogsMonitor.expectedDialogs = msg.expectedDialogs;
            }
        });
    }

    // Commands handling
    _onSwitchToMainWindowCommand (command) {
        this._switchToMainWindow(command);
    }


    // Routing
    _onReady (status) {
        this.parentDriverLink.onCommandExecuted(status);
    }


    // API
    start () {
        debugger;
        this.dialogsMonitor = new DialogsMonitor(this.initialDialogs);

        this.parentDriverLink
            .establishConnection()
            .then(response => {
                var id = response.result.id;

                this.contextStorage = new ContextStorage(window, id);

                this.dialogsMonitor.expectedDialogs = response.expectedDialogs;

                if (this._failIfClientCodeExecutionIsInterrupted())
                    return;

                var inCommandExecution = this.contextStorage.getItem(this.COMMAND_EXECUTING_FLAG) ||
                                         this.contextStorage.getItem(this.EXECUTING_IN_IFRAME_FLAG);

                if (inCommandExecution)
                    this._onReady(new DriverStatus({ isCommandResult: true }));
            });
    }
}
