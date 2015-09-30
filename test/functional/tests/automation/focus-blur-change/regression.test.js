'@fixture regression focus blur change events';
'@page ./tests/automation/focus-blur-change/regression.html';

'@require :eventTracker';
'@require :browser';

'@test'['B236526 - Change event raising if blur() is called by a client script'] = {
    '1.Focus input element': function () {
        var $input = $('#input1');

        eventTracker.track($input, 'change');

        $input[0].focus();
    },

    '2.Press some symbol in input and call blur on "keyup" event': function () {
        var input = $('#input1')[0];

        input.onkeyup = function () {
            input.blur();
        };

        act.press('a');
    },

    '3.Wait for blurring input': function () {
        act.wait(100);
    },

    '4.Check "change" event': function () {
        eq(eventTracker.getCount($('#input1'), 'change'), 1);
    }
};

'@test'['B236912 - change event raising if an element is focused before type action by a client script'] = {
    '1.Focus input element': function () {
        var $input = $('#input1');

        eventTracker.track($input, 'change');

        $input[0].focus();
    },

    '2.Type in input': function () {
        var $input = $('#input1');

        eq(eventTracker.getCount($input, 'change'), 0);

        act.type($input, 'test');
    },

    '3.Focus another input': function () {
        eq(eventTracker.getCount($('#input1'), 'change'), 0);

        $('#input2')[0].focus();
    },

    '4.Check "change" event': function () {
        eq(eventTracker.getCount($('#input1'), 'change'), 1);
    }
};

'@test'['B237366 - change event raising after sequential type actions'] = {
    '1.Type in first input': function () {
        var $input1 = $('#input1');
        var $input2 = $('#input2');

        eventTracker.track($input1, 'change');
        eventTracker.track($input2, 'change');

        act.type($input1, 'test1');
    },

    '2.Type in second input': function () {
        act.type($('#input2'), 'test2');
    },

    '3.Blur second input': function () {
        $('#input2')[0].blur();
    },

    '4.Check "change" events': function () {
        eq(eventTracker.getCount($('#input1'), 'change'), 1);
        eq(eventTracker.getCount($('#input2'), 'change'), 1);
    }
};

'@test'['B237489 - act.press("left") does not work in IE'] = {
    '1.Focus input element': function () {
        var input  = $('#input1')[0];
        var shared = this;

        input.addEventListener('focus', function () {
            shared.focusRaised = true;

            eq(document.activeElement, input);
        });

        eq(document.activeElement, document.body);

        input.focus();
    },

    '2.Wait for focusing': function () {
        act.wait(100);
    },

    '3.Check "focus" event': function () {
        ok(this.focusRaised);
    }
};

//ONLY: ie
'@test'['B237603 - two synchronously called focus() methods should raise an event once'] = {
    '1.Call focus for input twice': function () {
        if (!browser.isIE)
            return;

        var input = $('#input1')[0];

        eventTracker.track($(input), 'focus');

        input.focus();
        input.focus();

        eq(document.activeElement, input);
    },

    '2.Wait for focusing': function () {
        if (!browser.isIE)
            return;

        act.wait(100);
    },

    '3.Check "focus" event': function () {
        if (!browser.isIE)
            return;

        eq(eventTracker.getCount($('#input1'), 'focus'), 1);
    }
};

'@test'['B238617 - Label with "for" attribute focusing'] = {
    '1.Focus label element': function () {
        var $label = $('label:first');

        eventTracker.track($('#input2'), 'focus');
        eventTracker.track($label, 'focus');

        $label[0].focus();
    },

    '2.Wait for focusing': function () {
        act.wait(100);
    },

    '3.Check "focus" event': function () {
        var $input = $('#input2');

        eq(eventTracker.getCount($('label:first'), 'focus'), 0);
        eq(eventTracker.getCount($input, 'focus'), 1);

        if (!browser.isIE)
            eq(document.activeElement, $input[0]);
    }
};

'@test'['B238617 - Label with "for" attribute focusing (non-valid "for")'] = {
    '1.Focus label element': function () {
        var $label = $('label').attr('for', 'non-valid');

        eventTracker.track($('#input2'), 'focus');
        eventTracker.track($label, 'focus');

        $label[0].focus();
    },

    '2.Wait for focusing': function () {
        act.wait(100);
    },

    '3.Check "focus" event': function () {
        eq(eventTracker.getCount($('label:first'), 'focus'), 0);
        eq(eventTracker.getCount($('#input2'), 'focus'), 0);
        eq(document.activeElement, document.body);
    }
};

'@test'['B238617 - Label with "for" attribute focusing (check no internal flag)'] = {
    '1.Focus label element': function () {
        var label = $('label')[0];

        this.labelProperties = dumpProperties(label);

        label.focus();
    },

    '2.Wait for focusing': function () {
        act.wait(100);
    },

    '3.Check property objects': function () {
        var newLabelProperties = dumpProperties($('label')[0]);

        eq(getArrayDiff(this.labelProperties, newLabelProperties), getArrayDiff([], []), 'check properties');
    },

    '4.Focus label element with non valid "for" attribute': function () {
        var label = $('label').attr('for', 'non-valid')[0];

        this.labelProperties = dumpProperties(label);

        label.focus();
    },

    '5.Wait for focusing': function () {
        act.wait(100);
    },

    '6.Check property objects': function () {
        var newLabelProperties = dumpProperties($('label')[0]);

        eq(getArrayDiff(this.labelProperties, newLabelProperties), getArrayDiff([], []), 'check properties');
    }
};

'@test'['B238599, B239799 - Div with parent with tabindex focusing'] = {
    '1.Focus input element inside focusable div': function () {
        var $div  = $('#div1').attr('tabIndex', 0);
        var input = $('#input3')[0];

        input.disabled = 'disabled';

        eventTracker.track($div, 'focus');

        input.focus();
    },

    '2.Check parent is not focused and click on input': function () {
        eq(eventTracker.getCount($('#div1'), 'focus'), 0);
        eq(document.activeElement, document.body);

        act.click($('#input3'));
    },

    '3.Check parent is focused': function () {
        var $div = $('#div1');

        eq(eventTracker.getCount($div, 'focus'), 1);
        eq(document.activeElement, $div[0]);
    }
};

'@test'['B239273 - An Input\'s focusout event is not raised after click on a button in Firefox during test running'] = {
    '1.Focus input element': function () {
        var $input = $('#input1');

        eventTracker.track($input, 'focusout');

        $input[0].focus();
    },

    '2.Click on another input': function () {
        act.click($('#input2'));
    },

    '3.Check "focusout" event': function () {
        eq(eventTracker.getCount($('#input1'), 'focusout'), 1);
    }
};

'@test'['B251819 - Clicks on checkbox text don\'t change checkbox state during playback'] = {
    '1.Click on span element inside label': function () {
        act.click($('#spanForCheckbox'));
    },

    '2.Check checkbox checked state': function () {
        ok($('input[type="checkbox"]')[0].checked);
    }
};

//ONLY: except WebKit
'@test'['B252392 - Blur event is not raised when an input becomes invisible during test running'] = {
    '0.Init test run': function () {
        //NOTE: in IE we should call window.focus() to be sure that after set 'display = none'
        //blur event will raise
        if (browser.isIE)
            window.focus();
    },

    '1.Focus input element': function () {
        if (browser.isWebKit)
            return;

        var $input = $('#input2');

        eventTracker.track($input, 'blur');

        $input[0].focus();
    },

    '2.Click on another input': function () {
        if (browser.isWebKit)
            return;

        $('#input2')[0].style.display = 'none';

        act.click($('#input1'));
    },

    '3.Wait for results': function () {
        if (browser.isWebKit)
            return;

        act.wait(100);
    },

    '4.Check blur event raised': function () {
        if (browser.isWebKit)
            return;

        eq(eventTracker.getCount($('#input2'), 'blur'), 1);
    }
};

'@test'['B253577 - Focus handlers should be executed synchronously after mousedown'] = {
    '1.Click on input element': function () {
        var $input = $('#input2');
        var shared = this;

        $input.mousedown(function () {
            shared.mousedownRaised = true;

            setTimeoutForFunction(function () {
                shared.timeoutHandled = true;
            });
        });

        $input.focus(function () {
            ok(shared.mousedownRaised, 'check that mousedown handler was executed before focus');
            ok(!shared.timeoutHandled, 'check that timeout was not handled before focus');
            shared.focusRaised = true;
        });

        act.click($input);
    },

    '2.Check focus event raised and mouedown timeout expired': function () {
        ok(this.focusRaised, 'check that focus was raised');
        ok(this.timeoutHandled, 'check that timeout was raised');
    }
};

'@test'['B253735 - Blur event is raised twice in IE if element has zero width and height'] = {
    '1.Focus input element': function () {
        var $input = $('#input2');

        eventTracker.track($input, 'blur');

        $input[0].focus();
    },

    '2.Focus another input element': function () {
        var $input = $('#input2');

        $input.width(0);
        $input.height(0);
        $input.css('border', '0px');
        $input.css('margin', '0px');
        $input.css('padding', '0px');

        $('#input1')[0].focus();
    },

    '3.Check blur event raised': function () {
        var $input = $('#input2');

        ok(!$input.is(':visible'), 'check that element becomes invisible because of zero rectangle');
        eq(eventTracker.getCount($input, 'blur'), 1, 'blur handler executing checked');
    }
};

//ONLY: ie && version < 12
'@test'['Focus method must not have effect if it is called from focus event handler on its second phase (AT_TARGET) in IE'] = {
    '1.Focus table cell element': function () {
        if (!browser.isIE && browser.version > 11)
            return;

        var table     = $('table')[0];
        var tableCell = table.querySelectorAll('td')[0];
        var shared    = this;

        shared.focusCount = 0;
        this.startTime    = Date.now();
        this.timeout      = 2000;

        function focusHandler (e) {
            shared.focusCount++;

            //this code prevent page hanging
            if (Date.now() - shared.startTime < shared.timeout) {
                if (document.activeElement !== this) {
                    var savedActiveElement = document.activeElement;

                    this.focus();

                    var activeElementChanged = savedActiveElement !== document.activeElement;

                    if (e.eventPhase === 2)
                        ok(!activeElementChanged, 'check that active element was not changed after calling focus() on second event phase');
                    else
                        ok(activeElementChanged, 'check that active element was changed after calling focus()');
                }
            }
            else
                ok(false, 'timeout is exceeded');
        }

        $('#div2')[0].addEventListener('focus', focusHandler, true);
        table.addEventListener('focus', focusHandler, true);

        tableCell.focus();
    },

    '2.Wait for focusing': function () {
        act.wait(100);
    },

    '3.Check focus event count': function () {
        if (!browser.isIE && browser.version > 11)
            return;

        //6 focus handlers must be called. 1 and 2 - on event capturing phase for parent and child.
        //3 - when parent calls focus for himself. 4,5 - when child calls focus for himself (handled by both parent and child)
        //6 - when parent calls focus for himself in the second time.
        // if (browser.isIE && browser.version < 12)
        eq(this.focusCount, 6, 'checked number of focus handlers executed');
    }
};

'@test'['Focus and blur methods must raise events asynchronously and change active element synchronously in IE'] = {
    '1.Focus input element and check focus event raised immediately': function () {
        var $input = $('#input1');

        eventTracker.track($input, 'focus');
        eventTracker.track($input, 'blur');

        $input[0].focus();

        eq(document.activeElement, $input[0]);

        if (browser.isIE && browser.version < 12)
            eq(eventTracker.getCount($input, 'focus'), 0, 'check that focus event was not raised synchronously after focus() method calling');
    },

    '2.Wait for focusing': function () {
        act.wait(100);
    },

    '3.Check focus event raised after some time; Blur input element and check blur event raised immediately': function () {
        var $input = $('#input1');

        eq(eventTracker.getCount($input, 'focus'), 1, 'check that focus event was not raised synchronously after focus() method calling');

        $input[0].blur();

        eq(document.activeElement, document.body, 'check that active element was changed synchronously after blur');

        if (browser.isIE && browser.version < 12)
            eq(eventTracker.getCount($input, 'blur'), 0, 'check that blur event was not raised synchronously after blur() method calling');
    },

    '4.Wait for blurring': function () {
        act.wait(100);
    },

    '5.Check blur event raised after some time': function () {
        eq(eventTracker.getCount($('#input1'), 'blur'), 1, 'check that blur event was not raised synchronously after blur() method calling');
    }
};

'@test'['Change event not raised after press action if element was focused by client script'] = {
    '1.Focus input element': function () {
        var input = $('#input1')[0];

        input.value = 'test';

        eventTracker.track($(input), 'change');

        input.focus();
    },

    '2.Clear input value': function () {
        act.press('ctrl+a delete');
    },

    '3.Click another input element': function () {
        act.click($('#input2'));
    },

    '4.Check change event raised': function () {
        eq(eventTracker.getCount($('#input1'), 'change'), 1, 'change event was raised');
    }
};

//ONLY: ie
'@test'['B254768 - Blur event should be raised after focus event, if element becomes invisible synchronously after focus() method executing'] = {
    '1.Focus input element and make it invisible': function () {
        if (!browser.isIE)
            return;

        var input  = $('#input2')[0];
        var shared = this;

        input.onfocus = function (e) {
            shared.focusRaised = true;
            shared.lastEvent   = e.type;
        };

        input.onblur = function (e) {
            shared.blurRaised = true;
            shared.lastEvent  = e.type;
        };

        //NOTE: in IE we should call window.focus() to be sure that after set 'display = none'
        //blur event will raise
        if (browser.isIE)
            window.focus();

        input.focus();

        input.style.display = 'none';
    },

    '2.Check events raised': function () {
        if (!browser.isIE)
            return;

        ok(this.focusRaised, 'focus raised');
        ok(this.blurRaised, 'blur raised');
        eq(this.lastEvent, 'blur', 'last raised event is blur');
    }
};

'@test'['B254775 - Click action on already focused element must not raise focus event even if element was blurred on mousedown in IE'] = {
    '1.Focus input element': function () {
        $('#input1')[0].focus();
    },

    '2.Click on input element': function () {
        var $input = $('#input1');

        eventTracker.track($input, 'focus');
        eventTracker.track($input, 'blur');

        $input.bind('mousedown', function (e) {
            e.target.blur();
        });

        act.click($input);
    },

    '3.Check events raised': function () {
        var $input = $('#input1');

        eq(eventTracker.getCount($input, 'blur'), 1);

        if (browser.isIE) {
            eq(eventTracker.getCount($input, 'focus'), 0);
            eq(document.activeElement, document.body);
        }
        else {
            eq(eventTracker.getCount($input, 'focus'), 1);
            eq(document.activeElement, $input[0]);
        }
    }
};

//ONLY: ie
'@test'['Incorrect handlers queue bug (setTimeout)'] = {
    '1.Set queue actions with timeouts for input': function () {
        if (!browser.isIE)
            return;

        var input1 = $('#input1')[0];
        var input2 = $('#input2')[0];
        var shared = this;

        shared.state = [];

        input1.addEventListener('focus', function () {
            shared.state.push('3');

            setTimeoutForFunction(function () {
                shared.state.push('7');
            });

            input2.focus();

            shared.state.push('4');
        });

        input2.addEventListener('focus', function () {
            shared.state.push('5');
        });

        this.state.push('1');

        setTimeoutForFunction(function () {
            shared.state.push('6');
        });

        input1.focus();

        shared.state.push('2');
    },

    '2.Wait for timeouts expired': function () {
        if (!browser.isIE)
            return;

        act.wait(200);
    },

    '3.Check events queue': function () {
        if (!browser.isIE)
            return;

        if (browser.version < 12)
            eq(this.state.join(''), '1234567');
        else
            eq(this.state.join(''), '1354267');
    }
};

//ONLY: ie
'@test'['Incorrect handlers queue bug (setInterval)'] = {
    '1.Set function with inteval': function () {
        if (!browser.isIE)
            return;

        var shared = this;

        setIntervalForFunction(function () {
            shared.intervalFunctionCalled = true;
        });
    },

    '2.Wait for function execution': function () {
        if (!browser.isIE)
            return;

        act.wait(100);
    },

    '3.Focus input element': function () {
        if (!browser.isIE)
            return;

        var input                   = $('#input1')[0];
        var shared                  = this;

        ok(this.intervalFunctionCalled, 'check that interval function was called');
        this.intervalFunctionCalled = false;

        input.addEventListener('focus', function () {
            ok(!shared.intervalFunctionCalled, 'check that interval function was not called before focus handler');
            shared.focusRaised = true;
        });

        input.focus();

        if (browser.version < 12)
            ok(!this.focusRaised, 'check that focus handler was not executed synchronously after focus() method calling');
    },

    '4.Wait for input focusing': function () {
        if (!browser.isIE)
            return;

        act.wait(100);
    },

    '5.Check focus event raised and function with interval executed': function () {
        if (!browser.isIE)
            return;

        ok(this.focusRaised, 'check that focus handler was executed');
        ok(this.intervalFunctionCalled, 'check that interval function was called');
    }
};

'@test'['Change event must not be raised if element value was changed by blur handler (T110822)'] = {
    '1.Focus input element': function () {
        var input = $('#input1')[0];

        eventTracker.track($(input), 'change');

        input.onblur = function () {
            input.value = input.value + 'test';
        };

        input.focus();
    },

    '2.Blur input element': function () {
        $('#input1')[0].blur();
    },

    '3.Check change event doesn\'t raised': function () {
        eq(eventTracker.getCount($('#input1'), 'change'), 0);
    }
};

'@test'['T229732 - Focus and blur events bubble but should not during test running'] = {
    '1.Focus input element': function () {
        var $container = $('#div1').attr('tabIndex', 0);
        var $input     = $('#input3');

        eventTracker.track($container, 'focus');
        eventTracker.track($container, 'blur');

        eventTracker.track($input, 'focus');
        eventTracker.track($input, 'blur');

        $input[0].focus();
    },

    '2.Focus another input element': function () {
        eq(eventTracker.getCount($('#div1'), 'focus'), 0);
        eq(eventTracker.getCount($('#input3'), 'focus'), 1);

        $('#input1')[0].focus();
    },

    '3.Check blur events raised': function () {
        eq(eventTracker.getCount($('#div1'), 'blur'), 0);
        eq(eventTracker.getCount($('#input3'), 'blur'), 1);
    }

};

'@test'['T231934 - Native focus method raises event handlers twice in IE in recorder'] = {
    '1.Call focus for input by two different ways': function () {
        var input = $('#input2')[0];

        eventTracker.track($(input), 'focus');

        var focusEvent = document.createEvent('Event');
        focusEvent.initEvent('focus', true, true);
        input.dispatchEvent(focusEvent);

        $('#input1')[0].focus();
        input.focus();
    },

    '2.Check focus event raised': function () {
        eq(eventTracker.getCount($('#input2'), 'focus'), 2);
    }
};

'@test'['B237723 - Error on http://phonejs.devexpress.com/Demos/?url=KitchenSink&sm=3 on recording'] = {
    '1.Create iframe': function () {
        $('<iframe></iframe>')
            .attr('id', 'iframe')
            .attr('src', 'http://localhost:3000/tests/automation/focus-blur-change/iframe.html')
            .appendTo('body');

    },

    '2.Wait for iframe\'s input element': inIFrame('#iframe', function () {
        act.waitFor('#input');
    }),

    '3.Focus iframe\'s input element (should not raise error)': function () {
        $('#iframe')[0].contentWindow.focusInput();
    },

    '4.Check iframe\s active element': inIFrame('#iframe', function () {
        eq(document.activeElement, $('#input')[0])
    })
};

//utils
function dumpProperties (element) {
    var props        = [],
        currentProps = [],
        i            = 0;

    while (element) {
        currentProps = Object.getOwnPropertyNames(element);

        for (i = 0; i < currentProps.length; i++) {
            if (props.indexOf(currentProps[i]) < 0)
                props.push(currentProps[i]);
        }

        if (Object.getPrototypeOf)
            element = Object.getPrototypeOf(element);
        else
            element = element.__proto__;
    }

    return props;
}

function getArrayDiff (a, b) {
    var i    = 0,
        diff = {
            deleted: [],
            added:   []
        };

    a = !a ? [] : a;
    b = !b ? [] : b;

    for (i = 0; i < a.length; i++) {
        if (b.indexOf(a[i]) < 0) {
            diff.deleted.push(a[i]);
        }
    }

    for (i = 0; i < b.length; i++) {
        if (a.indexOf(b[i]) < 0) {
            diff.added.push(b[i]);
        }
    }

    return diff;
}

function setTimeoutForFunction (fn) {
    window.setTimeout(function () {
        fn();
    }, 0);
}

function setIntervalForFunction (fn) {
    window.setInterval(function () {
        fn();
    }, 0);
}
