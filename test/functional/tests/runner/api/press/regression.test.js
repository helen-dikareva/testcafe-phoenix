'@fixture regression press';
'@page ./tests/runner/api/press/regression.html';

'@require :eventTracker';
'@require :browser';

'@test'['T178354 - Wrong text selection in editable elements during press "tab" emulation'] = {
    '1.Press shortcut "tab"': function () {
        document.body.focus();
        $('#inputText').attr('tabIndex', 1);

        act.press('tab')
    },

    '2.Check changing active element and it\' selection state': function () {
        var input = $('#inputText')[0];

        eq(document.activeElement, input);
        eq(input.selectionStart, 0);
        eq(input.selectionEnd, input.value.length);
    }
};

'@test'['Press enter on the focused hyperlink'] = {
    "@testCases": [
        {
            '@name':      'B253200 - TestCafe doesn\'t emulate browsers behavior for press "enter" key on the focused HyperLink editor (link with href)',
            linkSelector: '#link'
        },
        {
            '@name':      'B253200 - TestCafe doesn\'t emulate browsers behavior for press "enter" key on the focused HyperLink editor (link with javascript)',
            linkSelector: '#link1'
        }
    ],

    '1.Create link anf focus it': function () {
        this.storageKey = 'linkClicked';

        var link   = $(this.linkSelector)[0];
        var shared = this;

        link.onclick = function () {
            //NOTE: setting vars to 'this' does not work here
            window.localStorage.setItem(shared.storageKey, true);
        };

        link.focus();

        //NOTE: we need set timeout for waiting of focus in IE
        act.wait(100);
    },

    '2.Press shortcut "enter"': function () {
        eq(document.activeElement, $(this.linkSelector)[0]);

        act.press('enter');
    },

    '3.Check shortcut effect': function () {
        eq(window.location.href, 'http://localhost:3000/tests/runner/api/click/index.html');
        eq(window.localStorage.getItem(this.storageKey), 'true');
        window.localStorage.removeItem(this.storageKey);
    }
};

'@test'['T138385 - Input with "maxLength" attribute'] = {
    '1.Create input "type = text" with "maxLength" attribute and call press action': function () {
        var $input = $('#inputText')
            .val('')
            .attr('maxLength', '3');

        eventTracker.track($input, 'input');

        $input[0].focus();

        act.press('t e s t');
    },

    '2.Check that "input" event is raised if symbol count more than "maxLength" attribute': function () {
        var $input = $('#inputText');

        eq(eventTracker.getCount($input, 'input'), 4);
        eq($input.val(), 'tes');
    },

    '3.Create input "type = number" with "maxLength" attribute and call press action': function () {
        var $input = $('#inputNumber')
            .attr('maxLength', '2');

        $input[0].focus();

        eventTracker.track($input, 'input');

        act.press('1 2 3');
    },

    '4.Check that input "type = number" leave out "maxLength" attribute': function () {
        var $input = $('#inputNumber');

        eq(eventTracker.getCount($input, 'input'), 3);
        eq($input.val(), browser.isIE ? '12' : '123');
    }
};

'@test'['T191234 - Press Enter key on a textbox element doesn\'t raise report\'s element updating during test running'] = {
    '1.Type symbol in input': function () {
        var $input = $('#inputText');
        var shared = this;

        this.changeCount = 0;

        $input.bind('change', function () {
            shared.changeCount++;
        });

        act.type($input, 'a');
    },

    '2.Press "enter" shortcut first time': function () {
        eq(document.activeElement, $('#inputText')[0]);
        eq(this.changeCount, 0);

        act.press('enter');
    },

    '3.Press "enter" shortcut second time': function () {
        eq(document.activeElement, $('#inputText')[0]);
        eq(this.changeCount, browser.isIE ? 0 : 1);

        act.press('enter');
    },

    '4.Check "change" event count': function () {
        eq(document.activeElement, $('#inputText')[0]);
        eq(this.changeCount, browser.isIE ? 0 : 1);
    }
};
