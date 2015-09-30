'@fixture regression press shortcuts';
'@page ./tests/automation/press-shortcuts/index.html';

'@require :selection';
"@require ../../../mixins/element-state.js";

'@test'['B238614 - Incorrectly selection reproduce'] = {
    '1.Press left in input': function () {
        var $input         = $('#inputText');
        var startSelection = 2;
        var endSelection   = 4;

        selection.set($input, startSelection, endSelection);

        this.selector      = '#inputText';
        this.expectedValue = $input.val();
        this.expectedStart = startSelection;

        act.press('left');
    },

    '2.Check shortcut effect': '@mixin Check element state',

    '3.Press right in input': function () {
        var $input         = $('#inputText');
        var startSelection = 2;
        var endSelection   = 4;

        selection.set($input, startSelection, endSelection);

        this.selector      = '#inputText';
        this.expectedValue = $input.val();
        this.expectedStart = endSelection;

        act.press('right');
    },

    '4.Check shortcut effect': '@mixin Check element state'
};

'@test'['B238809 - Press shift+home in textarea with forward multiline selection'] = {
    '1.Press shift+home in textarea with forward multiline selection': function () {
        var $textarea      = $('#textarea');
        var textareaValue  = $textarea.val();
        var startSelection = 2;
        var endSelection   = 7;

        selection.set($textarea, startSelection, endSelection);

        this.selector      = '#textarea';
        this.expectedValue = textareaValue;
        this.expectedStart = startSelection;
        this.expectedEnd   = textareaValue.indexOf('\n') + 1;

        act.press('shift+home');
    },

    '2.Check shortcut effect': '@mixin Check element state',

    '3.Press shift+home in textarea with backward multiline selection': function () {
        var $textarea      = $('#textarea');
        var startSelection = 2;
        var endSelection   = 7;

        selection.set($textarea, startSelection, endSelection, true);

        this.selector        = '#textarea';
        this.expectedValue   = $textarea.val();
        this.expectedStart   = 0;
        this.expectedEnd     = endSelection;
        this.expectedInverse = true;

        act.press('shift+home');
    },

    '4.Check shortcut effect': '@mixin Check element state'
};

'@test'['B238809 - Press shift+end in textarea with forward multiline selection'] = {
    '1.Press shift+end in textarea with forward multiline selection': function () {
        var $textarea      = $('#textarea');
        var textareaValue  = $textarea.val();
        var startSelection = 2;
        var endSelection   = 8;

        selection.set($textarea, startSelection, endSelection);

        this.selector      = '#textarea';
        this.expectedValue = textareaValue;
        this.expectedStart = startSelection;
        this.expectedEnd   = textareaValue.length;

        act.press('shift+end');
    },

    '2.Check shortcut effect': '@mixin Check element state',

    '3.Press shift+end in textarea with backward multiline selection': function () {
        var $textarea      = $('#textarea');
        var textareaValue  = $textarea.val();
        var startSelection = 2;
        var endSelection   = 7;

        selection.set($textarea, startSelection, endSelection, true);

        this.selector        = '#textarea';
        this.expectedValue   = textareaValue;
        this.expectedStart   = textareaValue.indexOf('\n');
        this.expectedEnd     = endSelection;
        this.expectedInverse = true;

        act.press('shift+end');
    },

    '4.Check shortcut effect': '@mixin Check element state'
};

'@test'['B233976 - Wrong recording key combination ctrl+a and delete'] = {
    '1.Press ctrl+a in textarea': function () {
        var $textarea     = $('#textarea');
        var textareaValue = $textarea.val();

        selection.set($textarea, 2);

        this.selector      = '#textarea';
        this.expectedValue = textareaValue;
        this.expectedStart = 0;
        this.expectedEnd   = textareaValue.length;

        act.press('ctrl+a');
    },

    '2.Check shortcut effect': '@mixin Check element state',

    '3.Press delete in textarea': function () {
        this.expectedValue = '';
        this.expectedStart = 0;
        this.expectedEnd   = 0;

        act.press('delete');
    },

    '4.Check shortcut effect': '@mixin Check element state'
};
