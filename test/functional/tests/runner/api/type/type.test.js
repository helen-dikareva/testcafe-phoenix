'@fixture type';
'@page ./tests/runner/api/type/index.html';

'@require :eventTracker';
'@require :event';

'@test'['Check key events raised correctly'] = {
    '1.Bind handlers and call type': function () {
        var $input = $('#inputText');
        var shared = this;

        //B253410
        eventTracker.track($input, ['click', 'keydown', 'keypress', 'keyup', 'input']);

        shared.oldValue = $input[0].value;
        shared.text     = 'HI';

        act.type($input, shared.text);
    },

    '2.Check that events were raised and call type again for the same input': function () {
        var $input = $('#inputText');

        eq(eventTracker.getCount($input, 'click'), 1, 'click event raises once');
        eq(eventTracker.getCount($input, 'keydown'), 2, 'keydown event raises twice');
        eq(eventTracker.getCount($input, 'keypress'), 2, 'keypress event raises twice');
        eq(eventTracker.getCount($input, 'keyup'), 2, 'keyup event raises twice');
        eq(eventTracker.getCount($input, 'input'), 2, 'input event raises twice'); //B253410
        eq($input[0].value, this.oldValue + this.text);

        this.oldValue = $input[0].value;
        this.text     = 'you';

        act.type($input[0], this.text);
    },

    '3.Check that events were raised': function () {
        var $input = $('#inputText');

        eq(eventTracker.getCount($input, 'click'), 1, 'click event raises once');
        eq(eventTracker.getCount($input, 'keydown'), 5, 'keydown event raises twice');
        eq(eventTracker.getCount($input, 'keypress'), 5, 'keypress event raises twice');
        eq(eventTracker.getCount($input, 'keyup'), 5, 'keyup event raises twice');
        eq(eventTracker.getCount($input, 'input'), 5, 'input event raises twice'); //B253410

        eq($input[0].value, this.oldValue + this.text);
    }
};

'@test'['Typing in two inputs'] = {
    '1.Call type for two inputs as first first parameter': function () {
        var firstInput = $('#inputText')[0];

        firstInput.value = '';
        this.text        = 'Hello, world!';

        act.type($('[type="text"]'), this.text)
    },

    '2.Check typing': function () {
        var $inputs = $('[type="text"]');
        eq($inputs[0].value, this.text, 'first element value changed');
        eq($inputs[1].value, this.text, 'second element value changed');
    }
};

'@test'['Type action with replace text'] = {
    '1.Call type for with "replace" option': function () {
        var $input = $('#inputText');
        this.text  = 'Hello, world!';

        act.type($input, this.text, { replace: true })
    },

    '2.Check typing': function () {
        eq($('#inputText')[0].value, this.text, 'old input value is replaced');
    }
};

'@test'['Type action raise keypress event with correct keyCode'] = {
    '1.Call type for two input as first parameter': function () {
        var $input = $('#inputText');
        var shared = this;

        $input.keypress(function (e) {
            shared.keypressRaised = true;
            eq((e || window.event).keyCode, 'k'.charCodeAt(0), 'keypress event "keyCode" argument is correct');
        });

        act.type($input, 'k')
    },

    '2.Check that keypress event raised': function () {
        ok(this.keypressRaised);
    }
};

'@test'['Call type action for outer element which contains input'] = {
    '1.Call type action for outer element which contains input': function () {
        var $container = $('#container');
        var $input     = $('#input');

        $input[0].value = '';
        this.text       = 'Hi';

        act.type($container, this.text)
    },

    '2.Check typing in input': function () {
        eq($('#input')[0].value, this.text, 'text inner input is changed');
    }
};

'@test'['Typing in readonly inputs'] = {
    '1.Set attribute "readonly" and call type for input': function () {
        var $input = $('#inputText').attr('readonly', '');

        this.oldValue = $input[0].value;

        act.type($input, 'test');
    },

    '2.Check that value does not changed and call type for input again': function () {
        var $input = $('#inputText');

        eq($input[0].value, this.oldValue);
        $input.attr('readonly', 'readonly');

        act.type($input, 'test');
    },

    '3.Check that values do not changed': function () {
        eq($('#inputText')[0].value, this.oldValue);
    }
};

'@test'['Input text doesn\'t changed on type if keydown event prevented'] = {
    '1.Type in input which prevent keydown': function(){
        var input = $('#inputText')[0];

        this.oldValue = input.value;

        input.onkeydown = event.preventDefault;

        act.type(input, 'new test');
    },

    '2.Check input value': function(){
        eq($('#inputText')[0].value, this.oldValue);
    }
};

'@test'['SHOULD FAIL: when the first argument is empty'] = {
    '1.Type on an nonexistent element': function () {
        act.type('#nonexistentElement');
    }
};

'@test'['SHOULD FAIL: when the "text" argument is empty'] = {
    '1.Type with "text" parameter is empty': function () {
        act.type('#inputText', '');
    }
};
