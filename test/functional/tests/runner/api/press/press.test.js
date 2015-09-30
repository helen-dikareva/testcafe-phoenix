'@fixture press';
'@page ./tests/runner/api/press/index.html';

'@require :eventTracker';
'@require :browser';
'@require :event';

'@test'['Check key events raised correctly'] = {
    '0.Init': '@mixin Set test conditions',

    '1.Bind handlers and call press': function () {
        var $input = $('#inputText');

        eventTracker.track($input, ['keydown', 'keypress', 'keyup']);

        act.press('ctrl+a backspace');
    },

    '2.Check that events were raised': function () {
        var $input = $('#inputText');

        eq(eventTracker.getCount($input, 'keydown'), 3, 'keydown event raises three times');
        eq(eventTracker.getCount($input, 'keypress'), browser.isMozilla ? 2 : 0, 'keypress event raises twice');
        eq(eventTracker.getCount($input, 'keyup'), 3, 'keyup event raises three times');
    }
};

'@test'['Press symbols'] = {
    '0.Set test conditions': '@mixin Set test conditions',

    '1.Press symbol "a"': function () {
        act.press('a');
    },

    '2.Check pressed symbols': function () {
        eq($('#inputText')[0].value, 'testa');
    },

    '3.Set test conditions': '@mixin Set test conditions',

    '4.Press symbol "+" (B238757)': function () {
        act.press('+');
    },

    '5.Check pressed symbols': function () {
        eq($('#inputText')[0].value, 'test+');
    },

    '6.Set test conditions': '@mixin Set test conditions',

    '7.Press symbol "shift++"': function () {
        act.press('shift++');
    },

    '8.Check pressed symbols': function () {
        eq($('#inputText')[0].value, 'test+');
    },

    '9.Set test conditions': '@mixin Set test conditions',

    '10.Press symbol "space"': function () {
        act.press('left space');
    },

    '11.Check pressed symbols': function () {
        eq($('#inputText')[0].value, 'tes t');
    },

    '12.Set test conditions': '@mixin Set test conditions',

    '13.Press symbol "shift+a"': function () {
        act.press('shift+a');
    },

    '14.Check pressed symbols': function () {
        eq($('#inputText')[0].value, 'testA');
    },

    '15.Set test conditions': '@mixin Set test conditions',

    '16.Press symbol "shift+1"': function () {
        act.press('shift+1');
    },

    '17.Check pressed symbols': function () {
        eq($('#inputText')[0].value, 'test!');
    },

    '18.Set test conditions': '@mixin Set test conditions',

    '19.Press symbol "shift+1"': function () {
        act.press('shift+1');
    },

    '20.Check pressed symbols': function () {
        eq($('#inputText')[0].value, 'test!');
    },

    '21.Set test conditions': '@mixin Set test conditions',

    '22.Press correct symbols combination': function () {
        act.press('g h g+h  f t');
    },

    '23.Check pressed symbols': function () {
        eq($('#inputText')[0].value, 'testghghft');
    },

    '24.Set test conditions': '@mixin Set test conditions'
};

'@test'['Shortcut must not be raised when preventDefault called'] = {
    '0.Init': '@mixin Set test conditions',

    '1.Bind handler with prevention event': function () {
        var $input = $('#inputText');

        $input.keydown(event.preventDefault);

        act.press('ctrl+a')
    },

    '2.Check that shortcut does not apply': function () {
        var input = $('#inputText')[0];

        notEq(input.value, getSelectedText(input), 'text not selected');
        eq(input.value, 'test', 'text is not changed');
    }
};

'@test'['SHOULD FAIL: when press has incorrect keys combination'] = {
    '1.Press with incorrect keys combination': function () {
        act.press('incorrect')
    }
};

//utils
'@mixin'['Set test conditions'] = {
    '0. Set test conditions': function () {
        var input = $('#inputText')[0];

        input.value = 'test';
        input.focus();
        input.setSelectionRange(4, 4);
    }
};

function getSelectedText (el) {
    return el.value.substring(el.selectionStart, el.selectionEnd);
}

function checkElementSelection (el, start, end) {
    return el.selectionStart === start && el.selectionEnd === end;
}
