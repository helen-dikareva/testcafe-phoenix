'@fixture rclick';
'@page ./tests/runner/api/rclick/index.html';

'@require :eventTracker';
'@require :browser';

'@test'['Check mouse events raised correctly'] = {
    '1.Bind mouse event handlers and call right click': function () {
        var $input = $('#input');
        var shared = this;

        shared.events = [];

        eventTracker.track($input, 'click');

        $input.on('mousedown mouseup contextmenu', function (e) {
            shared.events.push(e.type);

            ok(e.which, 2);
            eq(e.button, 2);

            if (browser.isIE || browser.isMozilla)
                eq(e.buttons, 2);
        });

        act.rclick($input);
    },

    '2.Check that handlers were called': function () {
        ok(!eventTracker.getCount($('#input'), 'click'));
        eq(this.events, ['mousedown', 'mouseup', 'contextmenu']);
    }
};

//ONLY: ie
'@test'['Pointer events test (T191183)'] = {
    'Bind pointer event handlers and call right click': function () {
        var input  = $('#input')[0];
        var shared = this;

        shared.events = [];

        function pointerHandler (e) {
            shared.events.push(e.type.toLowerCase().replace('ms', ''));
            eq(e.pointerType, browser.version > 10 ? 'mouse' : 4);
            eq(e.button, 2);
            eq(e.buttons, 2);
        }

        if (browser.isIE) {
            if (browser.version > 11) {
                input.onpointerdown = pointerHandler;
                input.onpointerup   = pointerHandler;
            }
            else {
                input.onmspointerdown = pointerHandler;
                input.onmspointerup   = pointerHandler;
            }
        }

        act.rclick(input);
    },

    'Check that handlers were called': function () {
        if (browser.isIE)
            eq(this.events, ['pointerdown', 'pointerup'], 'pointer events were raised');
    }
};
