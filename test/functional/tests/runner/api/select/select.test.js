'@fixture select';
'@page ./tests/runner/api/select/index.html';

'@require :eventTracker';
'@require :browser';
"@require ../../../../mixins/element-state.js";

var selectStartEvent       = browser.hasTouchEvents ? 'touchstart' : 'mousedown';
var selectEndEvent         = browser.hasTouchEvents ? 'touchend' : 'mouseup';
var checkScrollAfterSelect = !(browser.isMozilla || browser.isIE);

'@test'['Call select with different arguments for input'] = {
    '0.Init test run': function () {
        this.selector = '#inputText';

        eventTracker.track($(this.selector), [selectStartEvent, selectEndEvent]);
    },

    '1.Call select for dom element as a parameter': function () {
        var $input = $('#inputText');

        this.expectedStart = 0;
        this.expectedEnd   = $input[0].value.length;

        act.select($input[0]);
    },

    '2.Check selection state': '@mixin Check element state',

    '3.Check that selection began and ended at element': '@mixin Check selectionStart and selectionEnd events',

    '4.Call select with positive offset as a parameter': function () {
        this.expectedStart = 0;
        this.expectedEnd   = 5;

        act.select($('#inputText'), 5);
    },

    '5.Check selection state': '@mixin Check element state',

    '6.Check that selection began and ended at element': '@mixin Check selectionStart and selectionEnd events',

    '7.Call select with negative offset as a parameter': function () {
        var $input      = $('#inputText');
        var valueLength = $input[0].value.length;

        this.expectedStart   = valueLength - 5;
        this.expectedEnd     = valueLength;
        this.expectedInverse = true;

        act.select($input, -5);
    },

    '8.Check selection state': '@mixin Check element state',

    '9.Check that selection began and ended at element': '@mixin Check selectionStart and selectionEnd events',

    '10.Call select with zero offset as a parameter': function () {
        this.expectedStart   = 0;
        this.expectedEnd     = 0;
        this.expectedInverse = false;

        act.select($('#inputText'), 0);
    },

    '11.Check selection state': '@mixin Check element state',

    '12.Check that selection began and ended at element': '@mixin Check selectionStart and selectionEnd events',

    '13.Call select with startPos less than endPos as parameters': function () {
        this.expectedStart = 2;
        this.expectedEnd   = 4;

        act.select($('#inputText'), 2, 4);
    },

    '14.Check selection state': '@mixin Check element state',

    '15.Check that selection began and ended at element': '@mixin Check selectionStart and selectionEnd events',

    '16.Call select with startPos more than endPos as parameters': function () {
        this.expectedStart   = 2;
        this.expectedEnd     = 4;
        this.expectedInverse = true;

        act.select($('#inputText'), 4, 2);
    },

    '17.Check selection state': '@mixin Check element state',

    '18.Check that selection began and ended at element': '@mixin Check selectionStart and selectionEnd events',

    '19.Call select with startLine, startPos, endLine, endPos as parameters': function () {
        var $input = $('#inputText');

        this.expectedStart   = 2;
        this.expectedEnd     = $input[0].value.length;
        this.expectedInverse = false;

        act.select($input, 2, 15, 7, 15);
    },

    '20.Check selection state': '@mixin Check element state',

    '21.Check that selection began and ended at element': '@mixin Check selectionStart and selectionEnd events'
};

'@test'['Call select with different arguments for textarea'] = {
    '0.Init test run': function () {
        this.selector = '#textarea';

        eventTracker.track($(this.selector), [selectStartEvent, selectEndEvent]);
    },

    '1.Call select for dom element as a parameter': function () {
        var $textarea = $('#textarea');

        this.expectedStart = 0;
        this.expectedEnd   = $textarea[0].value.length;

        act.select($textarea[0]);
    },

    '2.Check selection state': '@mixin Check element state',

    '3.Check that selection began and ended at element': '@mixin Check selectionStart and selectionEnd events',

    '4.Call select with positive offset as a parameter': function () {
        this.expectedStart = 0;
        this.expectedEnd   = 5;

        act.select($('#textarea'), 5);
    },

    '5.Check selection state': '@mixin Check element state',

    '6.Check that selection began and ended at element': '@mixin Check selectionStart and selectionEnd events',

    '7.Call select with negative offset as a parameter': function () {
        var $textarea   = $('#textarea');
        var valueLength = $textarea[0].value.length;

        this.expectedStart   = valueLength - 5;
        this.expectedEnd     = valueLength;
        this.expectedInverse = true;

        act.select($textarea, -5);
    },

    '8.Check selection state': '@mixin Check element state',

    '9.Check that selection began and ended at element': '@mixin Check selectionStart and selectionEnd events',

    '10.Call select with startPos less than endPos as a parameters': function () {
        this.expectedStart   = 3;
        this.expectedEnd     = 20;
        this.expectedInverse = false;

        act.select($('#textarea'), 3, 20);
    },

    '11.Check selection state': '@mixin Check element state',

    '12.Check that selection began and ended at element': '@mixin Check selectionStart and selectionEnd events',

    '13.Call select with startPos more than endPos as a parameters': function () {
        this.expectedStart   = 3;
        this.expectedEnd     = 20;
        this.expectedInverse = true;

        act.select($('#textarea'), 20, 3);
    },

    '14.Check selection state': '@mixin Check element state',

    '15.Check that selection began and ended at element': '@mixin Check selectionStart and selectionEnd events',

    '16.Call select with startLine, startPos less than endLine, endPos as parameters': function () {
        var $textarea = $('#textarea');

        this.expectedStart   = getTextareaPositionByLineAndOffset($textarea, 0, 3);
        this.expectedEnd     = getTextareaPositionByLineAndOffset($textarea, 2, 7);
        this.expectedInverse = false;

        act.select($textarea, 0, 3, 2, 7);
    },

    '17.Check selection state': '@mixin Check element state',

    '18.Check that selection began and ended at element': '@mixin Check selectionStart and selectionEnd events',

    '19.Call select with startLine, startPos more than endLine, endPos as parameters': function () {
        var $textarea = $('#textarea');

        this.expectedStart   = getTextareaPositionByLineAndOffset($textarea, 0, 3);
        this.expectedEnd     = getTextareaPositionByLineAndOffset($textarea, 2, 7);
        this.expectedInverse = true;

        act.select($textarea, 2, 7, 0, 3);
    },

    '20.Check selection state': '@mixin Check element state',

    '21.Check that selection began and ended at element': '@mixin Check selectionStart and selectionEnd events',

    '22.Call select with startLine, startPos equal endLine, endPos as parameters': function () {
        var $textarea         = $('#textarea');
        var selectionPosition = getTextareaPositionByLineAndOffset($textarea, 2, 7);

        this.expectedStart   = selectionPosition;
        this.expectedEnd     = selectionPosition;
        this.expectedInverse = false;

        act.select($textarea, 2, 7, 2, 7);
    },

    '23.Check selection state': '@mixin Check element state',

    '24.Check that selection began and ended at element': '@mixin Check selectionStart and selectionEnd events',

    '25.Call select with startLine, startPos and endLine as parameters': function () {
        var $textarea     = $('#textarea');
        var textareaValue = $textarea[0].value;

        this.expectedStart = getTextareaPositionByLineAndOffset($textarea, 1, Math.min(8, textareaValue.split('\n')[1].length));
        this.expectedEnd   = textareaValue.length;

        act.select($textarea, 1, 8, 23);
    },

    '26.Check selection state': '@mixin Check element state',

    '27.Check that selection began and ended at element': '@mixin Check selectionStart and selectionEnd events',
};

'@test'['Selection in input with specific values'] = {
    '0.Init test run': function () {
        this.selector = '#inputText';

        eventTracker.track($(this.selector), [selectStartEvent, selectEndEvent]);
    },

    '1.Call select for input with empty value': function () {
        var $input = $('#inputText')
            .val('');

        this.expectedStart = 0;
        this.expectedEnd   = 0;

        act.select($input);
    },

    '2.Check selection state': '@mixin Check element state',

    '3.Check that selection began and ended at element': '@mixin Check selectionStart and selectionEnd events',

    '4.Call select for input with some spaces in succession': function () {
        var $input = $('#inputText');

        this.expectedStart = 3;
        this.expectedEnd   = 25;

        $input[0].value = '1   2     3    4    5      6';

        act.select($input, 3, 25);
    },

    '5.Check selection state': '@mixin Check element state',

    '6.Check that selection began and ended at element': '@mixin Check selectionStart and selectionEnd events',
};

'@test'['Selection in textarea with specific values'] = {
    '0.Init test run': function () {
        this.selector = '#textarea';

        eventTracker.track($(this.selector), [selectStartEvent, selectEndEvent]);
    },

    '1.Call select for textarea with empty value': function () {
        setTextToTextarea('');

        this.expectedStart = 0;
        this.expectedEnd   = 0;

        act.select($('#textarea'));
    },

    '2.Check selection state': '@mixin Check element state',

    '3.Check that selection began and ended at element': '@mixin Check selectionStart and selectionEnd events',

    '4.Call select for textarea with some empty strings': function () {
        setTextToTextarea('123456789abcd\n\n\nefghi\njklmop\n\nqwerty test cafe');

        var $textarea   = $('#textarea');
        var valueLength = $textarea[0].value.length;

        this.expectedStart = 3;
        this.expectedEnd   = valueLength - 3;

        act.select($textarea, 3, valueLength - 3);
    },

    '5.Check selection state': '@mixin Check element state',

    '6.Check that selection began and ended at element': '@mixin Check selectionStart and selectionEnd events'
};

'@test'['Selection in input with scrolling'] = {
    '1.Call select for input with forward scrolling': function () {
        var input  = $('#inputText')[0];
        var shared = this;

        input.value          = '1234567891012131415161718911200111554454455454545412121212121212';
        input.selectionStart = 0;
        input.selectionEnd   = 0;
        input.selectionLeft  = 0;

        this.events = [];

        input['on' + selectStartEvent] = function (e) {
            shared.events.push(e.type);

            eq($(input).scrollLeft(), 0);
        };

        input['on' + selectEndEvent] = function (e) {
            shared.events.push(e.type);

            if (checkScrollAfterSelect)
                ok($(input).scrollLeft() > 0);
        };

        this.selector      = '#inputText';
        this.expectedStart = 3;
        this.expectedEnd   = 33;

        act.select(input, 3, 33);
    },

    '2.Check selection state': '@mixin Check element state',

    '3.Check selection events and element scrolling': function () {
        eq(this.events, [selectStartEvent, selectEndEvent]);
        this.events = [];

        if (checkScrollAfterSelect)
            ok($('#inputText').scrollLeft() > 0);
    },

    '4.Call select for input with backward scrolling': function () {
        var input  = $('#inputText')[0];
        var shared = this;

        input.scrollLeft     = 0;
        input.selectionStart = 0;
        input.selectionEnd   = 0;

        this.oldScroll       = 0;

        input['on' + selectStartEvent] = function (e) {
            shared.events.push(e.type);

            shared.oldScroll = $(input).scrollLeft();

            if (checkScrollAfterSelect)
                ok($(input).scrollLeft() > 0);
        };

        input['on' + selectEndEvent] = function (e) {
            shared.events.push(e.type);

            if (checkScrollAfterSelect)
                ok($(input).scrollLeft() < shared.oldScroll);
        };

        this.expectedStart   = 0;
        this.expectedEnd     = 33;
        this.expectedInverse = true;

        act.select(input, 33, 0);
    },

    '5.Check selection state': '@mixin Check element state',

    '6.Check selection events and element scrolling': function () {
        var $input  = $('#inputText');

        eq(this.events, [selectStartEvent, selectEndEvent]);
        this.events = [];

        if (checkScrollAfterSelect)
            ok($input.scrollLeft() < this.oldScroll);
    }
};

'@test'['Selection in textarea with scrolling'] = {
    '1.Call forward select for textarea with right direction (endPos more than startPos)': function () {
        var $textarea = $('#textarea').height(100);
        var shared    = this;

        this.events = [];

        $textarea[0]['on' + selectStartEvent] = function (e) {
            shared.events.push(e.type);

            eq($textarea.scrollTop(), 0);
        };

        $textarea[0]['on' + selectEndEvent] = function (e) {
            shared.events.push(e.type);

            if (checkScrollAfterSelect)
                ok($textarea.scrollTop() > 0);
        };

        this.selector      = '#textarea';
        this.expectedStart = 2;
        this.expectedEnd   = 628;

        act.select($textarea, 2, 628);
    },

    '2.Check selection state': '@mixin Check element state',

    '3.Check selection events and element scrolling': function () {
        var $textarea = $('#textarea');

        eq(this.events, [selectStartEvent, selectEndEvent]);
        this.events   = [];

        if (checkScrollAfterSelect)
            ok($textarea.scrollTop() > 0);

        $textarea.scrollTop(0);
    },

    '4.Call forward select for textarea with left direction (endPos less than startPos)': function () {
        this.expectedStart = 34;
        this.expectedEnd   = 591;

        act.select($('#textarea'), 34, 591);
    },

    '5.Check selection state': '@mixin Check element state',

    '6.Check selection events and element scrolling': function () {
        var $textarea = $('#textarea');

        eq(this.events, [selectStartEvent, selectEndEvent]);
        this.events   = [];

        if (checkScrollAfterSelect)
            ok($textarea.scrollTop() > 0);

        $textarea.scrollTop(0);
    },

    '7.Call backward select for textarea with right direction (endPos less than startPos)': function () {
        var $textarea = $('#textarea');
        var shared    = this;

        this.oldScroll = 0;

        $textarea[0]['on' + selectStartEvent] = function (e) {
            shared.events.push(e.type);

            shared.oldScroll = $(textarea).scrollTop();
            ok(shared.oldScroll > 0);
        };

        $textarea[0]['on' + selectEndEvent] = function (e) {
            shared.events.push(e.type);

            if (checkScrollAfterSelect)
                ok($(textarea).scrollTop() < shared.oldScroll);
        };

        this.expectedStart   = 34;
        this.expectedEnd     = 591;
        this.expectedInverse = true;

        act.select($textarea, 591, 34);
    },

    '8.Check selection state': '@mixin Check element state',

    '9.Check selection events and element scrolling': function () {
        var $textarea = $('#textarea');

        eq(this.events, [selectStartEvent, selectEndEvent]);
        this.events   = [];

        if (checkScrollAfterSelect)
            ok($textarea.scrollTop() < this.oldScroll);

        $textarea.scrollTop(0);
    },

    '10.Call backward select for textarea with left direction (endPos more than startPos)': function () {
        this.expectedStart   = 2;
        this.expectedEnd     = 628;
        this.expectedInverse = true;

        act.select($('#textarea'), 628, 2);
    },

    '11.Check selection state': '@mixin Check element state',

    '12.Check selection events and element scrolling': function () {
        var $textarea = $('#textarea');

        eq(this.events, [selectStartEvent, selectEndEvent]);
        this.events   = [];

        if (checkScrollAfterSelect)
            ok($textarea.scrollTop() < this.oldScroll);
    }
};

'@test'['SHOULD FAIL: when the offset parameter is not a number'] = {
    '1.Select with offset parameter is not a number': function () {
        act.select($('#inputText'), 'abc');
    }
};

'@test'['SHOULD FAIL: when the endPos parameter is negative'] = {
    '1.Select with endPos parameter is negative': function () {
        act.select($('#inputText'), 2, -4);
    }
};

'@test'['SHOULD FAIL: when the endLine parameter is negative'] = {
    '1.Select with endLine parameter is negative': function () {
        act.select($('#textarea'), 2, 4, -2, 5);
    }
};

//utils
function getTextareaPositionByLineAndOffset ($textarea, line, offset) {
    var lines     = $textarea[0].value.split('\n'),
        lineIndex = 0;

    for (var i = 0; i < line; i++)
        lineIndex += lines[i].length + 1;

    return lineIndex + offset;
}

function setTextToTextarea (value) {
    var textarea = $('#textarea')[0];

    textarea.value       = value;
    textarea.textContent = value;
    $(textarea).text(value);
}

//mixin
'@mixin'['Check selectionStart and selectionEnd events'] = {
    'a.Check': function () {
        var $el = $(this.selector);

        ok(eventTracker.getCount($el, selectStartEvent), 'select started from element');
        ok(eventTracker.getCount($el, selectEndEvent), 'select ended on element');

        eventTracker.reset($el, selectStartEvent);
        eventTracker.reset($el, selectEndEvent);
    }
};
