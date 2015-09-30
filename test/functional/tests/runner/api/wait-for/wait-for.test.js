'@fixture waitFor';
'@page ./tests/runner/api/wait-for/index.html';

'@test'['WaitFor with success request'] = {
    '1.Wait for request': function () {
        this.contextCheck    = true;
        this.requestComplete = false;

        act.waitFor(function (callback) {
            var shared = this;

            ok(this.contextCheck, 'event should have access to shared data');

            $.get('/xhr-request/200', function () {
                shared.requestComplete = true;
                callback();
            });
        }, 1000);
    },

    '2.Check that request is complete': function () {
        ok(this.requestComplete);
    }
};

'@test'['Waiting for elements'] = {
    '1.Wait for element appearance': function () {
        createElement();

        act.waitFor('#testDivElement');
    },

    '2.Check that element appear': function () {
        ok($('#testDivElement').length);
    },

    '3.Wait for several elements appearance': function () {
        createElements();

        act.waitFor(['#testDivElement1', '#testDivElement2']);
    },

    '4.Check that elements appear': function () {
        ok($('#testDivElement1').length);
        ok($('#testDivElement2').length);
    }
};

'@test'['SHOULD FAIL: when timeout is expired'] = {
    '1.WaitFor with event argument': function () {
        act.waitFor(delay, 10);
    },

    '2.Wait for delay': function () {
        act.wait(1000);
    }
};

'@test'['SHOULD FAIL: when event argument is incorrect'] = {
    '1.Wait for event timeout': function () {
        act.waitFor(123, 20);
    }
};

'@test'['SHOULD FAIL: when timeout argument is incorrect'] = {
    '1.Wait for event timeout': function () {
        act.waitFor(function () {
        }, 'test');
    }
};

'@test'['SHOULD FAIL: when waitFor called for element and timeout expired'] = {
    '1.Wait for event timeout': function () {
        act.waitFor('#nonexistentElement', 250);
    }
};

'@test'['SHOULD FAIL: when waitFor called for several elements and timeout expired'] = {
    '1.Wait for event timeout': function () {
        $('<div></div>').attr('id', 'div').appendTo('body');

        act.waitFor(['#div', '#nonexistentElement2'], 150);
    }
};

//utils
function createElement () {
    var $el = $('<div></div>').attr('id', 'testDivElement');

    window.setTimeout(function () {
        $el.appendTo('body');
    }, 500);
}

function createElements () {
    var $el1 = $('<div></div>').attr('id', 'testDivElement1');
    var $el2 = $('<div></div>').attr('id', 'testDivElement2');

    window.setTimeout(function () {
        $el1.appendTo('body');

        window.setTimeout(function () {
            $el2.appendTo('body');
        }, 300);
    }, 300);
}

function delay (callback) {
    window.setTimeout(callback, 300);
}
