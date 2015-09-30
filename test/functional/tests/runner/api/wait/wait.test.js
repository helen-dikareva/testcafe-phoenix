'@fixture wait';
'@page ./tests/runner/api/wait/index.html';

var SHORT_DELAY              = 10;
var LONG_DELAY               = 1000;
var PAGE_SHORT_TIMEOUT_DELAY = 1000;
var PAGE_LONG_TIMEOUT_DELAY  = 1500;

var pageShortTimeoutExpired = false;
var pageShortTimeoutId      = null;

var pageLongTimeoutExpired = false;
var pageLongTimeoutId      = null;

'@test'['Wait with short ms parameter'] = {
    '1.Call wait action with short delay': function () {
        setPageTimeouts();

        act.wait(SHORT_DELAY);
    },

    '2.Check page timeouts': function () {
        ok(!pageShortTimeoutExpired, 'page short timeout doesn\'t over during wait action');
        ok(!pageLongTimeoutExpired, 'page short timeout doesn\'t over during wait action');
    }
};

'@test'['Wait with long ms parameter'] = {
    '1.Call wait action with long delay': function () {
        setPageTimeouts();

        act.wait(LONG_DELAY);
    },

    '2.Check page timeouts': function () {
        ok(pageShortTimeoutExpired, 'page short timeout doesn\'t over during wait action');
        ok(pageLongTimeoutExpired, 'page short timeout doesn\'t over during wait action');
    }
};

'@test'['Wait with feasible condition and long ms parameter'] = {
    '0.Init test': function () {
        setPageTimeouts();
    },

    '1.Call wait action with feasible condition and long ms parameter': function () {
        var i = 0;

        var condition = function () {
            ok(this.contextCheck, 'check of condition context');
            if (i !== 10) {
                i++;
                return false;
            }
            return true;
        };

        this.contextCheck = true;

        act.wait(LONG_DELAY, condition);
    },

    '2.Check page timeouts': function () {
        ok(pageShortTimeoutExpired, 'page short timeout doesn\'t over during wait action');
        ok(!pageLongTimeoutExpired, 'page short timeout doesn\'t over during wait action');
    }
};

'@test'['Wait with not feasible condition and long ms parameter'] = {
    '0.Init test': function () {
        setPageTimeouts();
    },

    '1.Call wait action with not feasible condition and long ms parameter': function () {
        var i         = 0;
        var condition = function () {
            return false;
        };

        act.wait(LONG_DELAY, condition);
    },

    '2.Check page timeouts': function () {
        ok(pageShortTimeoutExpired, 'page short timeout doesn\'t over during wait action');
        ok(pageLongTimeoutExpired, 'page short timeout doesn\'t over during wait action');
    }
};

'@test'['Wait with second parameter is not a function'] = {
    '1.Wait with second parameter is not a function': function () {
        setPageTimeouts();

        act.wait(SHORT_DELAY, 'abc');
    },

    '2.Check page timeouts': function () {
        ok(!pageShortTimeoutExpired, 'page short timeout doesn\'t over during wait action');
        ok(!pageLongTimeoutExpired, 'page short timeout doesn\'t over during wait action');
    }
};

'@test'['SHOULD FAIL: when first parameter is not a number'] = {
    '1.Wait with first parameter is not a number': function () {
        act.wait('abc');
    }
};

'@test'['SHOULD FAIL: when arguments are mixed up'] = {
    '1.Wait with mixed up arguments': function () {
        var i         = 0;
        var condition = function () {
            if (i !== 10) {
                i++;
                return false;
            }
            return true;
        };

        act.wait(condition, SHORT_DELAY);
    }
};

//utils
function setPageTimeouts () {
    pageShortTimeoutId = window.setTimeout(function () {
        pageShortTimeoutExpired = true;
    }, PAGE_SHORT_TIMEOUT_DELAY);

    pageLongTimeoutId = window.setTimeout(function () {
        pageLongTimeoutExpired = true;
    }, PAGE_LONG_TIMEOUT_DELAY);
}
