'@fixture press shortcuts';
'@page ./tests/automation/press-shortcuts/index.html';

'@require :browser';
'@require :selection';
"@require ../../../mixins/element-state.js";

'@test'['Press enter'] = {
    '1.Press "enter" in input': function () {
        var $input = $('#inputText');

        selection.set($input, 2);

        this.selector      = '#inputText';
        this.expectedValue = $input.val();
        this.expectedStart = 2;

        act.press('enter');
    },

    '2.Check shortcut effect': '@mixin Check element state',

    '3.Press "enter" in textarea': function () {
        var $textarea = $('#textarea').val('text');

        selection.set($textarea, 2);

        var newText = 'te\nxt';

        this.selector      = '#textarea';
        this.expectedValue = newText;
        this.expectedStart = newText.indexOf('\n') + 1;

        act.press('enter');
    },

    '4.Check shortcut effect': '@mixin Check element state'
};

'@test'['Press home'] = {
    '1.Press "home" in input': function () {
        var $input = $('#inputText');

        selection.set($input, 2);

        this.selector      = '#inputText';
        this.expectedValue = $input.val();
        this.expectedStart = 0;

        act.press('home');
    },

    '2.Check shortcut effect': '@mixin Check element state',

    '3.Press "home" in textarea': function () {
        var $textarea     = $('#textarea');
        var textareaValue = $textarea.val();

        selection.set($textarea, 7);

        this.selector      = '#textarea';
        this.expectedValue = textareaValue;
        this.expectedStart = textareaValue.indexOf('\n') + 1;

        act.press('home');
    },

    '4.Check shortcut effect': '@mixin Check element state',

    '5.Press "home" in input with selection': function () {
        var $input     = $('#inputText');
        var inputValue = $input.val();

        selection.set($input, 2, inputValue.length);

        this.selector      = '#inputText';
        this.expectedValue = inputValue;
        this.expectedStart = 0;

        act.press('home');
    },

    '6.Check shortcut effect': '@mixin Check element state'
};

'@test'['Press end'] = {
    '1.Press "end" in input': function () {
        var $input     = $('#inputText');
        var inputValue = $input.val();

        selection.set($input, 2);

        this.selector      = '#inputText';
        this.expectedValue = inputValue;
        this.expectedStart = inputValue.length;

        act.press('end');
    },

    '2.Check shortcut effect': '@mixin Check element state',

    '3.Press "end" in textarea': function () {
        var $textarea     = $('#textarea');
        var textareaValue = $textarea.val();

        selection.set($textarea, 7);

        this.selector      = '#textarea';
        this.expectedValue = textareaValue;
        this.expectedStart = textareaValue.length;

        act.press('end');
    },

    '4.Check shortcut effect': '@mixin Check element state',

    '5.Press "home" in input with selection': function () {
        var $input     = $('#inputText');
        var inputValue = $input.val();

        selection.set($input, 2, inputValue.length);

        this.selector      = '#inputText';
        this.expectedValue = inputValue;
        this.expectedStart = inputValue.length;

        act.press('end');
    },

    '6.Check shortcut effect': '@mixin Check element state'
};

'@test'['Press up'] = {
    '1.Press "up" in input': function () {
        var $input         = $('#inputText');
        var cursorPosition = 2;

        selection.set($input, cursorPosition);

        this.selector      = '#inputText';
        this.expectedValue = $input.val();
        this.expectedStart = browser.isWebKit ? 0 : cursorPosition;

        act.press('up');
    },

    '2.Check shortcut effect': '@mixin Check element state',

    '3.Press "up" in textarea': function () {
        var $textarea = $('#textarea');

        selection.set($textarea, 7);

        this.selector      = '#textarea';
        this.expectedValue = $textarea.val();
        this.expectedStart = 2;

        act.press('up');
    },

    '4.Check shortcut effect': '@mixin Check element state'
};

'@test'['Press down'] = {
    '1.Press "down" in input': function () {
        var $input         = $('#inputText');
        var inputValue     = $input.val();
        var cursorPosition = 2;

        selection.set($input, cursorPosition);

        this.selector      = '#inputText';
        this.expectedValue = inputValue;
        this.expectedStart = browser.isWebKit ? inputValue.length : cursorPosition;

        act.press('down');
    },

    '2.Check shortcut effect': '@mixin Check element state',

    '3.Press "down" in textarea': function () {
        var $textarea      = $('#textarea');
        var textareaValue  = $textarea.val();
        var cursorPosition = 2;

        selection.set($textarea, cursorPosition);

        this.selector      = '#textarea';
        this.expectedValue = textareaValue;
        this.expectedStart = cursorPosition + textareaValue.indexOf('\n') + 1;

        act.press('down');
    },

    '4.Check shortcut effect': '@mixin Check element state'
};

'@test'['Press left'] = {
    '1.Press "left" in input': function () {
        var $input         = $('#inputText');
        var cursorPosition = 2;

        selection.set($input, cursorPosition);

        this.selector      = '#inputText';
        this.expectedValue = $input.val();
        this.expectedStart = cursorPosition - 1;

        act.press('left');
    },

    '2.Check shortcut effect': '@mixin Check element state',

    '3.Press "left" in textarea': function () {
        var $textarea      = $('#textarea');
        var cursorPosition = 7;

        selection.set($textarea, cursorPosition);

        this.selector      = '#textarea';
        this.expectedValue = $textarea.val();
        this.expectedStart = cursorPosition - 1;

        act.press('left');
    },

    '4.Check shortcut effect': '@mixin Check element state'
};

'@test'['Press right'] = {
    '1.Press "right" in input': function () {
        var $input         = $('#inputText');
        var cursorPosition = 2;

        selection.set($input, cursorPosition);

        this.selector      = '#inputText';
        this.expectedValue = $input.val();
        this.expectedStart = cursorPosition + 1;

        act.press('right');
    },

    '2.Check shortcut effect': '@mixin Check element state',

    '3.Press "right" in textarea': function () {
        var $textarea      = $('#textarea');
        var cursorPosition = 7;

        selection.set($textarea, cursorPosition);

        this.selector      = '#textarea';
        this.expectedValue = $textarea.val();
        this.expectedStart = cursorPosition + 1;

        act.press('right');
    },

    '4.Check shortcut effect': '@mixin Check element state'
};

'@test'['Press backspace'] = {
    '1.Press "backspace" in input': function () {
        var $input         = $('#inputText');
        var inputValue     = $input.val();
        var cursorPosition = 2;

        selection.set($input, cursorPosition);

        this.selector      = '#inputText';
        this.expectedValue = inputValue.substring(0, cursorPosition - 1) + inputValue.substring(cursorPosition);
        this.expectedStart = cursorPosition - 1;

        act.press('backspace');
    },

    '2.Check shortcut effect': '@mixin Check element state',

    '3.Press "backspace" in textarea': function () {
        var $textarea      = $('#textarea');
        var cursorPosition = 5;

        selection.set($textarea, cursorPosition);

        this.selector      = '#textarea';
        this.expectedValue = $textarea.val().replace('\n', '');
        this.expectedStart = cursorPosition - 1;

        act.press('backspace');
    },

    '4.Check shortcut effect': '@mixin Check element state'
};

'@test'['Press delete'] = {
    '1.Press "delete" in input': function () {
        var $input         = $('#inputText');
        var inputValue     = $input.val();
        var cursorPosition = 2;

        selection.set($input, cursorPosition);

        this.selector      = '#inputText';
        this.expectedValue = inputValue.substring(0, cursorPosition) + inputValue.substring(cursorPosition + 1);
        this.expectedStart = cursorPosition;

        act.press('delete');
    },

    '2.Check shortcut effect': '@mixin Check element state',

    '3.Press "delete" in textarea': function () {
        var $textarea      = $('#textarea');
        var cursorPosition = 4;

        selection.set($textarea, cursorPosition);

        this.selector      = '#textarea';
        this.expectedValue = $textarea.val().replace('\n', '');
        this.expectedStart = cursorPosition;

        act.press('delete');
    },

    '4.Check shortcut effect': '@mixin Check element state'
};

'@test'['Press ctrl+a'] = {
    '1.Press "ctrl+a" in input': function () {
        var $input         = $('#inputText');
        var inputValue     = $input.val();
        var cursorPosition = 2;

        selection.set($input, cursorPosition);

        this.selector      = '#inputText';
        this.expectedValue = inputValue;
        this.expectedStart = 0;
        this.expectedEnd   = inputValue.length;

        act.press('ctrl+a');
    },

    '2.Check shortcut effect': '@mixin Check element state',

    '3.Press "ctrl+a" in textarea': function () {
        var $textarea     = $('#textarea');
        var textareaValue = $textarea.val();

        selection.set($textarea, 2);

        this.selector      = '#textarea';
        this.expectedValue = textareaValue;
        this.expectedStart = 0;
        this.expectedEnd   = textareaValue.length;

        act.press('ctrl+a');
    },

    '4.Check shortcut effect': '@mixin Check element state',

    '5.Press "ctrl+a backspace" in textarea': function () {
        var $textarea = $('#textarea');

        selection.set($textarea, 2);

        this.selector      = '#textarea';
        this.expectedValue = '';
        this.expectedStart = 0;
        this.expectedEnd   = 0;

        act.press('ctrl+a backspace');
    },

    '6.Check shortcut effect': '@mixin Check element state'
};

'@test'['Press shift+left'] = {
    '1.Press "shift+left" in input': function () {
        var $input         = $('#inputText');
        var cursorPosition = 2;

        selection.set($input, cursorPosition);

        this.selector        = '#inputText';
        this.expectedValue   = $input.val();
        this.expectedStart   = cursorPosition - 1;
        this.expectedEnd     = cursorPosition;
        this.expectedInverse = true;

        act.press('shift+left');
    },

    '2.Check shortcut effect': '@mixin Check element state',

    '3.Press "shift+left" in textarea': function () {
        var $textarea      = $('#textarea');
        var cursorPosition = 6;

        selection.set($textarea, 6);

        this.selector        = '#textarea';
        this.expectedValue   = $textarea.val();
        this.expectedStart   = cursorPosition - 4;
        this.expectedEnd     = cursorPosition;
        this.expectedInverse = true;

        act.press('shift+left shift+left shift+left shift+left');
    },

    '4.Check shortcut effect': '@mixin Check element state',

    '5.Press "shift+left" in textarea with forward selection': function () {
        var textareaValue  = 'text\narea\ntest';
        var $textarea      = $('#textarea').val(textareaValue);
        var startSelection = 7;
        var endSelection   = 10;

        selection.set($textarea, startSelection, endSelection);

        this.selector        = '#textarea';
        this.expectedValue   = textareaValue;
        this.expectedStart   = endSelection - 4;
        this.expectedEnd     = startSelection;
        this.expectedInverse = true;

        act.press('shift+left shift+left shift+left shift+left');
    },

    '6.Check shortcut effect': '@mixin Check element state',

    '7.Press "shift+left" in textarea with backward selection': function () {
        var textareaValue  = 'text\narea\ntest';
        var $textarea      = $('#textarea').val(textareaValue);
        var startSelection = 7;
        var endSelection   = 10;

        selection.set($textarea, startSelection, endSelection, true);

        this.selector        = '#textarea';
        this.expectedValue   = textareaValue;
        this.expectedStart   = startSelection - 4;
        this.expectedEnd     = endSelection;
        this.expectedInverse = true;

        act.press('shift+left shift+left shift+left shift+left');
    },

    '8.Check shortcut effect': '@mixin Check element state'
};

'@test'['Press shift+right'] = {
    '1.Press "shift+right" in input': function () {
        var $input         = $('#inputText');
        var cursorPosition = 2;

        selection.set($input, cursorPosition);

        this.selector      = '#inputText';
        this.expectedValue = $input.val();
        this.expectedStart = cursorPosition;
        this.expectedEnd   = cursorPosition + 1;

        act.press('shift+right');
    },

    '2.Check shortcut effect': '@mixin Check element state',

    '3.Press "shift+right" in textarea': function () {
        var $textarea      = $('#textarea');
        var cursorPosition = 3;

        selection.set($textarea, cursorPosition);

        this.selector      = '#textarea';
        this.expectedValue = $textarea.val();
        this.expectedStart = cursorPosition;
        this.expectedEnd   = cursorPosition + 4;

        act.press('shift+right shift+right shift+right shift+right');
    },

    '4.Check shortcut effect': '@mixin Check element state',

    '5.Press "shift+right" in textarea with forward selection': function () {
        var textareaValue  = 'text\narea\ntest';
        var $textarea      = $('#textarea').val(textareaValue);
        var startSelection = 3;
        var endSelection   = 7;

        selection.set($textarea, startSelection, endSelection);

        this.selector      = '#textarea';
        this.expectedValue = textareaValue;
        this.expectedStart = startSelection;
        this.expectedEnd   = endSelection + 4;

        act.press('shift+right shift+right shift+right shift+right');
    },

    '6.Check shortcut effect': '@mixin Check element state',

    '7.Press "shift+right" in textarea with backward selection': function () {
        var textareaValue  = 'text\narea\ntest';
        var $textarea      = $('#textarea').val(textareaValue);
        var startSelection = 2;
        var endSelection   = 12;

        selection.set($textarea, startSelection, endSelection, true);

        this.selector        = '#textarea';
        this.expectedValue   = textareaValue;
        this.expectedStart   = startSelection + 4;
        this.expectedEnd     = endSelection;
        this.expectedInverse = true;

        act.press('shift+right shift+right shift+right shift+right');
    },

    '8.Check shortcut effect': '@mixin Check element state'
};

'@test'['Press shift+up'] = {
    '1.Press "shift+up" in input': function () {
        var $input         = $('#inputText');
        var cursorPosition = 2;

        selection.set($input, cursorPosition);

        this.selector        = '#inputText';
        this.expectedValue   = $input.val();
        this.expectedStart   = browser.isWebKit ? 0 : cursorPosition;
        this.expectedEnd     = cursorPosition;
        this.expectedInverse = browser.isWebKit;

        act.press('shift+up');
    },

    '2.Check shortcut effect': '@mixin Check element state',

    '3.Press "shift+up" in textarea': function () {
        var $textarea      = $('#textarea');
        var cursorPosition = 7;

        selection.set($textarea, cursorPosition);

        this.selector        = '#textarea';
        this.expectedValue   = $textarea.val();
        this.expectedStart   = cursorPosition - 5;
        this.expectedEnd     = cursorPosition;
        this.expectedInverse = true;

        act.press('shift+up');
    },

    '4.Check shortcut effect': '@mixin Check element state',

    '5.Press "shift+up" in textarea with forward selection': function () {
        var textareaValue  = 'aaaa\nbbbb\ncccc';
        var $textarea      = $('#textarea').val(textareaValue);
        var startSelection = 8;
        var endSelection   = 12;

        selection.set($textarea, startSelection, endSelection);

        this.selector        = '#textarea';
        this.expectedValue   = textareaValue;
        this.expectedStart   = startSelection - 1;
        this.expectedEnd     = startSelection;
        this.expectedInverse = true;

        act.press('shift+up');
    },

    '6.Check shortcut effect': '@mixin Check element state',

    '7.Press "shift+up" in textarea with backward selection': function () {
        var textareaValue  = 'aaaa\nbbbb\ncccc';
        var $textarea      = $('#textarea').val(textareaValue);
        var startSelection = 8;
        var endSelection   = 12;

        //NOTE: to reset curentTextareaIndent
        document.activeElement.blur();

        selection.set($textarea, startSelection, endSelection, true);

        this.selector        = '#textarea';
        this.expectedValue   = textareaValue;
        this.expectedStart   = startSelection - 5;
        this.expectedEnd     = endSelection;
        this.expectedInverse = true;

        act.press('shift+up');
    },

    '8.Check shortcut effect': '@mixin Check element state'
};

'@test'['Press shift+down'] = {
    '1.Press "shift+down" in input': function () {
        var $input         = $('#inputText');
        var inputValue     = $input.val();
        var cursorPosition = 2;

        selection.set($input, cursorPosition);

        this.selector      = '#inputText';
        this.expectedValue = inputValue;
        this.expectedStart = cursorPosition;
        this.expectedEnd   = browser.isWebKit ? inputValue.length : cursorPosition;

        act.press('shift+down');
    },

    '2.Check shortcut effect': '@mixin Check element state',

    '3.Press "shift+down" in textarea': function () {
        var $textarea      = $('#textarea');
        var cursorPosition = 2;

        selection.set($textarea, cursorPosition);

        this.selector      = '#textarea';
        this.expectedValue = $textarea.val();
        this.expectedStart = cursorPosition;
        this.expectedEnd   = cursorPosition + 5;

        act.press('shift+down');
    },

    '4.Check shortcut effect': '@mixin Check element state',

    '5.Press "shift+down" in textarea with forward selection': function () {
        var textareaValue  = 'aaaa\nbbbb\ncccc';
        var $textarea      = $('#textarea').val(textareaValue);
        var startSelection = 3;
        var endSelection   = 8;

        //NOTE: to reset curentTextareaIndent
        document.activeElement.blur();

        selection.set($textarea, startSelection, endSelection);

        this.selector      = '#textarea';
        this.expectedValue = textareaValue;
        this.expectedStart = startSelection;
        this.expectedEnd   = endSelection + 5;

        act.press('shift+down');
    },

    '6.Check shortcut effect': '@mixin Check element state',

    '7.Press "shift+down" in textarea with backward selection': function () {
        var textareaValue  = 'aaaa\nbbbb\ncccc';
        var $textarea      = $('#textarea').val(textareaValue);
        var startSelection = 8;
        var endSelection   = 12;

        selection.set($textarea, startSelection, endSelection, true);

        this.selector      = '#textarea';
        this.expectedValue = textareaValue;
        this.expectedStart = endSelection;
        this.expectedEnd   = startSelection + 5;

        act.press('shift+down');
    },

    '8.Check shortcut effect': '@mixin Check element state'
};

'@test'['Press shift+home'] = {
    '1.Press "shift+home" in input': function () {
        var $input         = $('#inputText');
        var cursorPosition = 2;

        selection.set($input, cursorPosition);

        this.selector        = '#inputText';
        this.expectedValue   = $input.val();
        this.expectedStart   = 0;
        this.expectedEnd     = cursorPosition;
        this.expectedInverse = true;

        act.press('shift+home');
    },

    '2.Check shortcut effect': '@mixin Check element state',

    '3.Press "shift+home" in textarea': function () {
        var $textarea      = $('#textarea');
        var textareaValue  = $textarea.val();
        var cursorPosition = 7;

        selection.set($textarea, cursorPosition);

        this.selector        = '#textarea';
        this.expectedValue   = textareaValue;
        this.expectedStart   = textareaValue.indexOf('\n') + 1;
        this.expectedEnd     = cursorPosition;
        this.expectedInverse = true;

        act.press('shift+home');
    },

    '4.Check shortcut effect': '@mixin Check element state',

    '5.Press "shift+home" in textarea with forward selection': function () {
        var $textarea      = $('#textarea');
        var textareaValue  = $textarea.val();
        var startSelection = 7;
        var endSelection   = 8;

        selection.set($textarea, startSelection, endSelection);

        this.selector        = '#textarea';
        this.expectedValue   = textareaValue;
        this.expectedStart   = textareaValue.indexOf('\n') + 1;
        this.expectedEnd     = startSelection;
        this.expectedInverse = true;

        act.press('shift+home');
    },

    '6.Check shortcut effect': '@mixin Check element state',

    '7.Press "shift+home" in textarea with backward selection': function () {
        var $textarea      = $('#textarea');
        var textareaValue  = $textarea.val();
        var startSelection = 7;
        var endSelection   = 8;

        selection.set($textarea, startSelection, endSelection, true);

        this.selector        = '#textarea';
        this.expectedValue   = textareaValue;
        this.expectedStart   = textareaValue.indexOf('\n') + 1;
        this.expectedEnd     = endSelection;
        this.expectedInverse = true;

        act.press('shift+home');
    },

    '8.Check shortcut effect': '@mixin Check element state'
};

'@test'['Press shift+end'] = {
    '1.Press "shift+end" in input': function () {
        var $input         = $('#inputText');
        var inputValue     = $input.val();
        var cursorPosition = 2;

        selection.set($input, cursorPosition);

        this.selector      = '#inputText';
        this.expectedValue = inputValue;
        this.expectedStart = cursorPosition;
        this.expectedEnd   = inputValue.length;

        act.press('shift+end');
    },

    '2.Check shortcut effect': '@mixin Check element state',

    '3.Press "shift+end" in textarea': function () {
        var $textarea      = $('#textarea');
        var textareaValue  = $textarea.val();
        var cursorPosition = 7;

        selection.set($textarea, cursorPosition);

        this.selector      = '#textarea';
        this.expectedValue = textareaValue;
        this.expectedStart = cursorPosition;
        this.expectedEnd   = textareaValue.length;

        act.press('shift+end');
    },

    '4.Check shortcut effect': '@mixin Check element state',

    '5.Press "shift+end" in textarea with forward selection': function () {
        var $textarea      = $('#textarea');
        var textareaValue  = $textarea.val();
        var startSelection = 7;
        var endSelection   = 8;

        selection.set($textarea, startSelection, endSelection);

        this.selector      = '#textarea';
        this.expectedValue = textareaValue;
        this.expectedStart = startSelection;
        this.expectedEnd   = textareaValue.length;

        act.press('shift+end');
    },

    '6.Check shortcut effect': '@mixin Check element state',

    '7.Press "shift+end" in textarea with backward selection': function () {
        var $textarea      = $('#textarea');
        var textareaValue  = $textarea.val();
        var startSelection = 7;
        var endSelection   = 8;

        selection.set($textarea, startSelection, endSelection, true);

        this.selector      = '#textarea';
        this.expectedValue = textareaValue;
        this.expectedStart = endSelection;
        this.expectedEnd   = textareaValue.length;

        act.press('shift+end');
    },

    '8.Check shortcut effect': '@mixin Check element state'
};


'@test'['Press down/up in multiline textarea'] = {
    '1.Press down first time': function () {
        var textareaValue = 'text\narea\ntest';
        var $textarea     = $('#textarea').val(textareaValue);

        selection.set($textarea, 2);

        this.selector      = '#textarea';
        this.expectedValue = textareaValue;
        this.expectedStart = 7;

        act.press('down');
    },

    '2.Check shortcut effect': '@mixin Check element state',

    '3.Press down second time': function () {
        this.expectedStart = 12;

        act.press('down');
    },

    '4.Check shortcut effect': '@mixin Check element state',

    '5.Press down third time': function () {
        this.expectedStart = $('#textarea').val().length;

        act.press('down');
    },

    '6.Check shortcut effect': '@mixin Check element state',

    '7.Press up first time': function () {
        selection.set($('#textarea'), 12);

        this.expectedStart = 7;

        act.press('up');
    },

    '8.Check shortcut effect': '@mixin Check element state',

    '9.Press up second time': function () {
        this.expectedStart = 2;

        act.press('up');
    },

    '10.Check shortcut effect': '@mixin Check element state',

    '11.Press up third time': function () {
        this.expectedStart = 0;

        act.press('up');
    },

    '12.Check shortcut effect': '@mixin Check element state'
};

'@test'['Shortcut inside keys combination'] = {
    '1.Press "left+a" in input': function () {
        var inputValue     = '1';
        var $input         = $('#inputText').val(inputValue);
        var cursorPosition = inputValue.length;

        selection.set($input, cursorPosition);

        this.selector      = '#inputText';
        this.expectedValue = 'a1';
        this.expectedStart = cursorPosition;

        act.press('left+a');
    },

    '2.Check shortcut effect': '@mixin Check element state',

    '3.Press "a+left" in input': function () {
        var inputValue     = '1';
        var $input         = $('#inputText').val(inputValue);
        var cursorPosition = inputValue.length;

        selection.set($input, cursorPosition);

        this.selector      = '#inputText';
        this.expectedValue = '1a';
        this.expectedStart = cursorPosition;

        act.press('a+left');
    },

    '4.Check shortcut effect': '@mixin Check element state',

    '5.Press "left+home" in textarea': function () {
        var $textarea      = $('#textarea');
        var textareaValue  = $textarea.val();
        var cursorPosition = 7;

        selection.set($textarea, cursorPosition);

        this.selector      = '#textarea';
        this.expectedValue = textareaValue;
        this.expectedStart = textareaValue.indexOf('\n') + 1;

        act.press('left+home');
    },

    '6.Check shortcut effect': '@mixin Check element state',

    '7.Press "home+left" in textarea': function () {
        var $textarea      = $('#textarea');
        var cursorPosition = 7;

        selection.set($textarea, cursorPosition);

        this.selector      = '#textarea';
        this.expectedValue = $textarea.val();
        this.expectedStart = 4;

        act.press('home+left');
    },

    '8.Check shortcut effect': '@mixin Check element state'
};
