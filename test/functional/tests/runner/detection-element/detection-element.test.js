'@fixture Detection element after events simulation';
'@page ./tests/runner/detection-element/index.html';

'@require :browser';

var elementOneMousedownCount   = 0;
var elementOneMouseupCount     = 0;
var elementOneClickCount       = 0;
var elementOneDblclickCount    = 0;
var elementOneContextmenuCount = 0;
var elementOneSelectCount      = 0;

var elementTwoMousedownCount   = 0;
var elementTwoMouseupCount     = 0;
var elementTwoClickCount       = 0;
var elementTwoDblclickCount    = 0;
var elementTwoContextmenuCount = 0;
var elementTwoSelectCount      = 0;

var elementOneKeydownCount  = 0;
var elementOneKeypressCount = 0;
var elementOneKeyupCount    = 0;

var elementTwoKeydownCount  = 0;
var elementTwoKeypressCount = 0;
var elementTwoKeyupCount    = 0;

'@test'['Change element during click action'] = {
    '1.Click on element and change element on "mousedown" event': function () {
        var $div1 = $('#div1');

        resetMouseEventsCounters();
        bindMouseEventsHandlers($div1, $('#div2'), 'mousedown');

        act.click($div1);
    },

    '2.Check events raised': function () {
        eq(elementOneMousedownCount, 1);
        eq(elementOneMouseupCount, 0);
        eq(elementOneClickCount, 0);

        eq(elementTwoMousedownCount, 0);
        eq(elementTwoMouseupCount, 1);
        eq(elementTwoClickCount, 0);
    },

    '3.Click on element and change element on "mouseup" event': function () {
        var $div1 = $('#div1');

        resetMouseEventsCounters();
        bindMouseEventsHandlers($div1, $('#div2'), 'mouseup');

        act.click($div1);
    },

    '4.Check events raised': function () {
        eq(elementOneMousedownCount, 1);
        eq(elementOneMouseupCount, 1);
        eq(elementOneClickCount, 1);

        eq(elementTwoMousedownCount, 0);
        eq(elementTwoMouseupCount, 0);
        eq(elementTwoClickCount, 0);
    },

    '5.Click on element and change element on "click" event': function () {
        var $div1 = $('#div1');

        resetMouseEventsCounters();
        bindMouseEventsHandlers($div1, $('#div2'), 'click');

        act.click($div1);
    },

    '6.Check events raised': function () {
        eq(elementOneMousedownCount, 1);
        eq(elementOneMouseupCount, 1);
        eq(elementOneClickCount, 1);

        eq(elementTwoMousedownCount, 0);
        eq(elementTwoMouseupCount, 0);
        eq(elementTwoClickCount, 0);
    }
};

'@test'['Change element during rclick action'] = {
    '1.Rclick on element and change element on "mousedown" event': function () {
        var $div1 = $('#div1');

        resetMouseEventsCounters();
        bindMouseEventsHandlers($div1, $('#div2'), 'mousedown');

        act.rclick($div1);
    },

    '2.Check events raised': function () {
        eq(elementOneMousedownCount, 1);
        eq(elementOneMouseupCount, 0);
        eq(elementOneContextmenuCount, 0);

        eq(elementTwoMousedownCount, 0);
        eq(elementTwoMouseupCount, 1);
        eq(elementTwoContextmenuCount, 1);
    },

    '3.Rclick on element and change element on "mouseup" event': function () {
        var $div1 = $('#div1');

        resetMouseEventsCounters();
        bindMouseEventsHandlers($div1, $('#div2'), 'mouseup');

        act.rclick($div1);
    },

    '4.Check events raised': function () {
        eq(elementOneMousedownCount, 1);
        eq(elementOneMouseupCount, 1);
        eq(elementOneContextmenuCount, 0);

        eq(elementTwoMousedownCount, 0);
        eq(elementTwoMouseupCount, 0);
        eq(elementTwoContextmenuCount, 1);
    },

    '5.Rclick on element and change element on "contextmenu" event': function () {
        var $div1 = $('#div1');

        resetMouseEventsCounters();
        bindMouseEventsHandlers($div1, $('#div2'), 'contextmenu');

        act.rclick($div1);
    },

    '6.Check events raised': function () {
        eq(elementOneMousedownCount, 1);
        eq(elementOneMouseupCount, 1);
        eq(elementOneContextmenuCount, 1);

        eq(elementTwoMousedownCount, 0);
        eq(elementTwoMouseupCount, 0);
        eq(elementTwoContextmenuCount, 0);
    }
};

'@test'['Change element during select action'] = {
    '1.Select on element and change element on "mousedown" event': function () {
        var $input1 = $('#input1');
        var $input2 = $('#input2');

        resetMouseEventsCounters();

        if (browser.hasTouchEvents)
            bindTouchEventsHandlers($input1, $input2, 'touchstart', true);
        else
            bindMouseEventsHandlers($input1, $input2, 'mousedown', true);

        act.select($input1, 2, 4);
    },

    '2.Check events raised': function () {
        eq(elementOneMousedownCount, 1);
        eq(elementOneSelectCount, 0);
        eq(elementOneMouseupCount, 0);

        eq(elementTwoMousedownCount, 0);

        if (!browser.hasTouchEvents)
            ok(elementTwoSelectCount > 0);

        eq(elementTwoMouseupCount, 1);
    },

    '3.Select on element and change element on "mouseup" event': function () {
        var $input1 = $('#input1');
        var $input2 = $('#input2');

        resetMouseEventsCounters();

        if (browser.hasTouchEvents)
            bindTouchEventsHandlers($input1, $input2, 'touchend', true);
        else
            bindMouseEventsHandlers($input1, $input2, 'mouseup', true);

        act.select($input1, 2, 4);
    },

    '4.Check events raised': function () {
        eq(elementOneMousedownCount, 1);

        if (!browser.hasTouchEvents)
            ok(elementOneSelectCount > 0);

        eq(elementOneMouseupCount, 1);

        eq(elementTwoMousedownCount, 0);
        eq(elementTwoSelectCount, 0);
        eq(elementTwoMouseupCount, 0);
    }
};

'@test'['Change element during dblclick action'] = {
    '1.Dblclick on element and change element on first "mousedown" event': function () {
        var $div1 = $('#div1');

        resetMouseEventsCounters();
        bindMouseEventsHandlers($div1, $('#div2'), 'mousedown');

        act.dblclick($div1);
    },

    '2.Check events raised': function () {
        eq(elementOneMousedownCount, 1);
        eq(elementOneMouseupCount, 0);
        eq(elementOneClickCount, 0);
        eq(elementOneDblclickCount, 0);

        eq(elementTwoMousedownCount, 1);
        eq(elementTwoMouseupCount, 2);
        eq(elementTwoClickCount, 1);
        eq(elementTwoDblclickCount, 1);
    },

    '3.Dblclick on element and change element on first "mouseup" event': function () {
        var $div1 = $('#div1');

        resetMouseEventsCounters();
        bindMouseEventsHandlers($div1, $('#div2'), 'mouseup');

        act.dblclick($div1);
    },

    '4.Check events raised': function () {
        eq(elementOneMousedownCount, 1);
        eq(elementOneMouseupCount, 1);
        eq(elementOneClickCount, 1);
        eq(elementOneDblclickCount, 0);

        eq(elementTwoMousedownCount, 1);
        eq(elementTwoMouseupCount, 1);
        eq(elementTwoClickCount, 1);
        eq(elementTwoDblclickCount, 1);
    },

    '5.Dblclick on element and change element on first "click" event': function () {
        var $div1 = $('#div1');

        resetMouseEventsCounters();
        bindMouseEventsHandlers($div1, $('#div2'), 'click');

        act.dblclick($div1);
    },

    '6.Check events raised': function () {
        eq(elementOneMousedownCount, 1);
        eq(elementOneMouseupCount, 1);
        eq(elementOneClickCount, 1);
        eq(elementOneDblclickCount, 0);

        eq(elementTwoMousedownCount, 1);
        eq(elementTwoMouseupCount, 1);
        eq(elementTwoClickCount, 1);
        eq(elementTwoDblclickCount, 1);
    },

    '7.Dblclick on element and change element on second "mousedown" event': function () {
        var $div1 = $('#div1');

        resetMouseEventsCounters();
        bindMouseEventsHandlers($div1, $('#div2'), 'mousedown', false, true);

        act.dblclick($div1);
    },

    '8.Check events raised': function () {
        eq(elementOneMousedownCount, 2);
        eq(elementOneMouseupCount, 1);
        eq(elementOneClickCount, 1);
        eq(elementOneDblclickCount, 0);

        eq(elementTwoMousedownCount, 0);
        eq(elementTwoMouseupCount, 1);
        eq(elementTwoClickCount, 0);
        eq(elementTwoDblclickCount, 0);
    },

    '9.Dblclick on element and change element on second "mouseup" event': function () {
        var $div1 = $('#div1');

        resetMouseEventsCounters();
        bindMouseEventsHandlers($div1, $('#div2'), 'mouseup', false, true);

        act.dblclick($div1);
    },

    '10.Check events raised': function () {
        eq(elementOneMousedownCount, 2);
        eq(elementOneMouseupCount, 2);
        eq(elementOneClickCount, 2);
        eq(elementOneDblclickCount, 1);

        eq(elementTwoMousedownCount, 0);
        eq(elementTwoMouseupCount, 0);
        eq(elementTwoClickCount, 0);
        eq(elementTwoDblclickCount, 0);
    },

    '11.Dblclick on element and change element on second "click" event': function () {
        var $div1 = $('#div1');

        resetMouseEventsCounters();
        bindMouseEventsHandlers($div1, $('#div2'), 'click', false, true);

        act.dblclick($div1);
    },

    '12.Check events raised': function () {
        eq(elementOneMousedownCount, 2);
        eq(elementOneMouseupCount, 2);
        eq(elementOneClickCount, 2);
        eq(elementOneDblclickCount, 1);

        eq(elementTwoMousedownCount, 0);
        eq(elementTwoMouseupCount, 0);
        eq(elementTwoClickCount, 0);
        eq(elementTwoDblclickCount, 0);
    },

    '13.Dblclick on element and change element on "dblclick" event': function () {
        var $div1 = $('#div1');

        resetMouseEventsCounters();
        bindMouseEventsHandlers($div1, $('#div2'), 'dblclick');

        act.dblclick($div1);
    },

    '14.Check events raised': function () {
        eq(elementOneMousedownCount, 2);
        eq(elementOneMouseupCount, 2);
        eq(elementOneClickCount, 2);
        eq(elementOneDblclickCount, 1);

        eq(elementTwoMousedownCount, 0);
        eq(elementTwoMouseupCount, 0);
        eq(elementTwoClickCount, 0);
        eq(elementTwoDblclickCount, 0);
    }
};

'@test'['Change element during type action'] = {
    '1.Type in element and change element on "keydown" event': function () {
        var $input1 = $('#input1').val('');
        var $input2 = $('#input2').val('');

        resetKeyEventsCounters();
        bindKeyEventsHandlers($input1, $input2, 'keydown');

        act.type($input1, 'a');
    },

    '2.Check events raised': function () {
        eq(elementOneKeydownCount, 1);
        eq(elementOneKeypressCount, 0);
        eq(elementOneKeyupCount, 0);

        eq(elementTwoKeydownCount, 0);
        eq(elementTwoKeypressCount, 1);
        eq(elementTwoKeyupCount, 1);

        eq($('#input1').val(), '');
        eq($('#input2').val(), 'a');
    },

    '3.Type in element and change element on "keydown" event': function () {
        var $input1 = $('#input1').val('');
        var $input2 = $('#input2').val('');

        resetKeyEventsCounters();
        bindKeyEventsHandlers($input1, $input2, 'keypress');

        act.type($input1, 'a');
    },

    '4.Check events raised': function () {
        eq(elementOneKeydownCount, 1);
        eq(elementOneKeypressCount, 1);
        eq(elementOneKeyupCount, 0);

        eq(elementTwoKeydownCount, 0);
        eq(elementTwoKeypressCount, 0);
        eq(elementTwoKeyupCount, 1);

        eq($('#input1').val(), 'a');
        eq($('#input2').val(), '');
    },

    '5.Type in element and change element on "keyup" event': function () {
        var $input1 = $('#input1').val('');
        var $input2 = $('#input2').val('');

        resetKeyEventsCounters();
        bindKeyEventsHandlers($input1, $input2, 'keyup');

        act.type($input1, 'a');
    },

    '6.Check events raised': function () {
        eq(elementOneKeydownCount, 1);
        eq(elementOneKeypressCount, 1);
        eq(elementOneKeyupCount, 1);

        eq(elementTwoKeydownCount, 0);
        eq(elementTwoKeypressCount, 0);
        eq(elementTwoKeyupCount, 0);

        eq($('#input1').val(), 'a');
        eq($('#input2').val(), '');
    }
};

//utils
function resetMouseEventsCounters () {
    elementOneMousedownCount   = 0;
    elementOneMouseupCount     = 0;
    elementOneClickCount       = 0;
    elementOneDblclickCount    = 0;
    elementOneContextmenuCount = 0;
    elementOneSelectCount      = 0;

    elementTwoMousedownCount   = 0;
    elementTwoMouseupCount     = 0;
    elementTwoClickCount       = 0;
    elementTwoDblclickCount    = 0;
    elementTwoContextmenuCount = 0;
    elementTwoSelectCount      = 0;
}

function resetKeyEventsCounters () {
    elementOneKeydownCount  = 0;
    elementOneKeypressCount = 0;
    elementOneKeyupCount    = 0;

    elementTwoKeydownCount  = 0;
    elementTwoKeypressCount = 0;
    elementTwoKeyupCount    = 0;
}

function bindMouseEventsHandlers ($el1, $el2, eventName, checkMousemove, toSecondHandler) {
    var el1           = $el1[0];
    var el2           = $el2[0];
    var isSecondEvent = false;

    el1.onmousedown = function (e) {
        elementOneMousedownCount++;

        if (e.type === eventName && (!toSecondHandler || isSecondEvent))
            swapLocationOfElements($el1, $el2);

        if (!isSecondEvent && eventName === e.type)
            isSecondEvent = true;
    };

    el1.onmouseup = function (e) {
        elementOneMouseupCount++;

        if (e.type === eventName && (!toSecondHandler || isSecondEvent))
            swapLocationOfElements($el1, $el2);

        if (!isSecondEvent && eventName === e.type)
            isSecondEvent = true;
    };

    el1.onclick = function (e) {
        elementOneClickCount++;

        if (e.type === eventName && (!toSecondHandler || isSecondEvent))
            swapLocationOfElements($el1, $el2);

        if (!isSecondEvent && eventName === e.type)
            isSecondEvent = true;
    };

    el1.ondblclick = function (e) {
        elementOneDblclickCount = true;

        if (e.type === eventName)
            swapLocationOfElements($el1, $el2);
    };

    el1.oncontextmenu = function (e) {
        elementOneContextmenuCount++;

        if (e.type === eventName)
            swapLocationOfElements($el1, $el2);
    };


    el2.onmousedown = function () {
        elementTwoMousedownCount++;
    };

    el2.onmouseup = function () {
        elementTwoMouseupCount++;
    };

    el2.onclick = function () {
        elementTwoClickCount++;
    };

    el2.ondblclick = function () {
        elementTwoDblclickCount++;
    };

    el2.oncontextmenu = function () {
        elementTwoContextmenuCount++;
    };

    if (checkMousemove) {
        el1.onmousemove = function () {
            if (( elementOneMousedownCount === 1 && !elementOneMouseupCount) ||
                ( elementTwoMousedownCount === 1 && !elementTwoMouseupCount))
                elementOneSelectCount++;
        };

        el2.onmousemove = function () {
            if (( elementOneMousedownCount === 1 && !elementOneMouseupCount) ||
                ( elementTwoMousedownCount === 1 && !elementTwoMouseupCount))
                elementTwoSelectCount++;
        };
    }
}

function bindTouchEventsHandlers ($el1, $el2, eventName, checkMousemove) {
    var el1 = $el1[0];
    var el2 = $el2[0];

    el1.ontouchstart = function (e) {
        elementOneMousedownCount++;

        if (eventName === e.type)
            swapLocationOfElements($el1, $el2);
    };

    el1.ontouchend = function (e) {
        elementOneMouseupCount++;

        if (eventName === e.type)
            swapLocationOfElements($el1, $el2);
    };

    el2.ontouchstart = function (e) {
        elementTwoMousedownCount++;

        if (eventName === e.type)
            swapLocationOfElements($el1, $el2);
    };

    el2.ontouchend = function (e) {
        elementTwoMouseupCount++;

        if (eventName === e.type)
            swapLocationOfElements($el1, $el2);
    };

    if (checkMousemove) {
        el1.ontouchmove = function () {
            if ((elementOneMousedownCount === 1 && !elementOneMouseupCount) ||
                (elementTwoMousedownCount === 1 && !elementTwoMouseupCount))
                elementOneSelectCount++;
        };

        el2.ontouchmove = function () {
            if ((elementOneMousedownCount === 1 && !elementOneMouseupCount) ||
                (elementTwoMousedownCount === 1 && !elementTwoMouseupCount))
                elementTwoSelectCount++;
        };
    }
}

function bindKeyEventsHandlers ($el1, $el2, eventName) {
    var el1 = $el1[0];
    var el2 = $el2[0];

    el1.onkeydown = function (e) {
        elementOneKeydownCount++;

        if (e.type === eventName)
            $el2.focus();
    };

    el1.onkeypress = function (e) {
        elementOneKeypressCount++;

        if (e.type === eventName)
            $el2.focus();
    };

    el1.onkeyup = function (e) {
        elementOneKeyupCount++;

        if (e.type === eventName)
            $el2.focus();
    };


    el2.onkeydown = function () {
        elementTwoKeydownCount++;
    };

    el2.onkeypress = function () {
        elementTwoKeypressCount++;
    };

    el2.onkeyup = function () {
        elementTwoKeyupCount++;
    };
}

function swapLocationOfElements ($el1, $el2) {
    var left1 = $el1.css('left'),
        top1  = $el1.css('top'),
        left2 = $el2.css('left'),
        top2  = $el2.css('top');

    $el1.css({
        left: left2,
        top:  top2
    });

    $el2.css({
        left: left1,
        top:  top1
    });
}
