import TYPE from './type';

export function isCommandRejectableByPageError (command) {
    return !isObservationCommand(command) && !isBrowserManipulationCommand(command) && !isServiceCommand(command) ||
           isRejectablePrepareBrowserManipulationCommand(command) && !isWindowSwitchingCommand(command);
}

export function isObservationCommand (command) {
    return command.type === TYPE.executeClientFunction ||
           command.type === TYPE.executeSelector ||
           command.type === TYPE.wait;
}

function isWindowSwitchingCommand (command) {
    return command.type === TYPE.switchToIframe || command.type === TYPE.switchToMainWindow;
}

export function isBrowserManipulationCommand (command) {
    return command.type === TYPE.takeScreenshot ||
           command.type === TYPE.takeScreenshotOnFail ||
           command.type === TYPE.resizeWindow ||
           command.type === TYPE.resizeWindowToFitDevice;
}

function isRejectablePrepareBrowserManipulationCommand (command) {
    return command.type === TYPE.prepareBrowserManipulation &&
           (command.manipulationCommandType === TYPE.resizeWindow ||
            command.manipulationCommandType === TYPE.resizeWindowToFitDevice);
}

function isServicePrepareBrowserManipulationCommand (command) {
    return command.type === TYPE.prepareBrowserManipulation &&
           command.manipulationCommandType === TYPE.takeScreenshotOnFail;
}

export function isServiceCommand (command) {
    return command.type === TYPE.testDone ||
           command.type === TYPE.takeScreenshotOnFail ||
           isServicePrepareBrowserManipulationCommand(command);
}

export function isHandleDialogCommand (command) {
    return command.type === TYPE.handleAlert || command.type === TYPE.handleConfirm ||
           command.type === TYPE.handlePrompt || command.type === TYPE.handleBeforeUnload;
}

export function isExecutableInTopWindowOnly (command) {
    return command.type === TYPE.testDone ||
           command.type === TYPE.prepareBrowserManipulation ||
           command.type === TYPE.switchToMainWindow ||
           isHandleDialogCommand(command);
}

