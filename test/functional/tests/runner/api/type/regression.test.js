'@fixture regression type';
'@page ./tests/runner/api/type/index.html';

'@require :eventTracker';
'@require :browser';

'@test'['Change event must not be raised if keypress was prevented (B253816)'] = {
    '1.Bind "change" event handler and call type action': function () {
        var $input = $('#inputText');

        eventTracker.track($input, 'change');

        act.type($input, 'new')
    },

    '2.Call blur for input': function () {
        $('#inputText')[0].blur();
    },

    '3.Bind "keypress" event handler with prevention and call type action': function () {
        var $input = $('#inputText');

        ok(eventTracker.getCount($input, 'change'), 'change event was raised if keypress was not prevented');
        eventTracker.reset($input, 'change');

        $input.bind('keypress', function (e) {
            e.target.value += String.fromCharCode(e.keyCode);
            return false;
        });

        act.type($input, 'text');
    },

    '4.Call blur for input': function () {
        $('#inputText')[0].blur();
    },

    '5.Check that "change" event was not raised': function () {
        ok(!eventTracker.getCount($('#inputText'), 'change'), 'change event was not raised if keypress was prevented');
    }
};

'@test'['Keypress args must contain charCode of the symbol, not keyCode'] = {
    "@testCases": [
        {'@name': 'Type symbol "!"', symbol: '!', keyCode: 49, charCode: 33},
        {
            '@name': 'T239547 - TD15.1 - Playback problems on jsfiddle.net',
            symbol: '-',
            keyCode: browser.isMozilla ? 173 : 189,
            charCode: 45
        }
    ],
    '1.Bind required handlers and call type action': function () {
        var $input = $('#inputText');
        var shared = this;

        $input.val('');

        $input.keydown(function (e) {
            eq(e.keyCode, shared.keyCode, 'keyCode on keydown checked');
        });

        $input.keypress(function (e) {
            eq(e.keyCode, shared.charCode, 'keyCode on keypress checked');
            eq(e.charCode, shared.charCode, 'charCode on keypress checked');
        });

        act.type($input, shared.symbol);
    },

    '2.Check typing': function () {
        eq($('#inputText').val(), this.symbol, 'input value checked');
    }
};

'@test'['T138385 - Input with "maxLength" attribute'] = {
    '1.Create input "type = text" with "maxLength" attribute and call type action': function () {
        var $input = $('#inputText')
            .val('')
            .attr('maxLength', '3');

        eventTracker.track($input, 'input');

        act.type($input, 'test');
    },

    '2.Check that "input" event is raised if symbol count more than "maxLength" attribute': function () {
        var $input = $('#inputText');

        eq(eventTracker.getCount($input, 'input'), 4);
        eq($input.val(), 'tes');
    },

    '3.Create input "type = number" with "maxLength" attribute and call type action': function () {
        var $input = $('#input')
            .val('')
            .attr('maxLength', '2');

        $input[0].type = 'number';

        eventTracker.track($input, 'input');

        act.type($input, '123');
    },

    '4.Check that input "type = number" leave out "maxLength" attribute': function () {
        var $input = $('#input');

        eq(eventTracker.getCount($input, 'input'), 3);
        eq($input.val(), browser.isIE ? '12' : '123');
    }
};
