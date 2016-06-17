const DIALOG_TEXT = {
    alert:        '"Alert!"',
    confirm:      '"Confirm?"',
    prompt:       '"Prompt:"',
    beforeunload: '"Before unload"'
};


exports.getExpectedDialogNotAppearedErrorText = function getExpectedDialogNotAppearedErrorText (dialogType) {
    return 'The expected native ' + dialogType + ' dialog did not appear.' +
           ' Make sure that this dialog is invoked and the "handle..." function\'s "timeout" ' +
           'setting provides sufficient time for it to appear.';
};

exports.getUnexpectedDialogErrorText = function (dialogType) {
    return 'An unexpected native ' + dialogType + ' dialog with text ' + DIALOG_TEXT[dialogType] + ' appeared.' +
           ' If this dialog was invoked as a result of a test action, call a "handle..." function ' +
           'that handles this type of dialog after the action.';
};
