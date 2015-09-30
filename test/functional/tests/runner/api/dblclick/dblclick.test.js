'@fixture dblclick';
'@page ./tests/runner/api/dblclick/index.html';

'@require :eventTracker';

'@test'['Call dblclick with different arguments'] = {
    '1.Call dblclick for dom element as a parameter': function () {
        var $input = $('#input');

        eventTracker.track($input, ['dblclick', 'focus']);

        act.dblclick($input[0]);
    },

    '2.Check dblclicked state and call dblclick for jQuery object with two elements as a parameter': function () {
        var $input = $('#input');

        checkThatEventRaised($input, 'dblclick');
        checkThatEventRaised($input, 'focus');

        var $inputs = $('#input, #inputText');

        eventTracker.track($('#inputText'), ['dblclick']);

        act.dblclick($inputs);
    },

    '3.Check dblclick count': function () {
        checkThatEventRaised($('#input'), 'dblclick');
        checkThatEventRaised($('#inputText'), 'dblclick');
    }
};

'@test'['Call dblclick with options keys'] = {
    '1.Call dblclick with option keys': function () {
        var $input = $('#input');
        var shared = this;

        $input.dblclick(function (e) {
            shared.alt   = e.altKey;
            shared.ctrl  = e.ctrlKey;
            shared.shift = e.shiftKey;
            shared.meta  = e.metaKey;
        });

        act.dblclick($input, {
            alt:   true,
            ctrl:  true,
            shift: true,
            meta:  true
        });
    },

    '2.Check dblclick event options': function () {
        ok(this.alt, 'alt key is pressed');
        ok(this.shift, 'shift key is pressed');
        ok(this.ctrl, 'ctrl key is pressed');
        ok(this.meta, 'meta key is pressed');
    }
};

'@test'['Check mouse events raised correctly'] = {
    '1.Bind mouse event handlers and call dblclick': function () {
        var $input = $('#input');

        eventTracker.track($input, ['click', 'dblclick']);

        act.dblclick($input);
    },

    '2.Check that handlers were called': function () {
        var $input = $('#input');

        eq(eventTracker.getCount($input, 'click'), 2, 'click event raised twice');
        eq(eventTracker.getCount($input, 'dblclick'), 1, 'dblclick event raised once');
    }
};

'@test'['SHOULD FAIL: when the first argument is empty'] = {
    '1.Click on an nonexistent element': function () {
        act.click('#nonexistentElement');
    }
};

//utils
function checkThatEventRaised ($el, event) {
    eq(eventTracker.getCount($el, event), 1, event + ' raised');
    eventTracker.reset($el, event);
}
