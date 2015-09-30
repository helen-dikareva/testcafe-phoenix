'@fixture hover';
'@page ./tests/runner/api/hover/index.html';

'@require :eventTracker';
'@require :browser';

//ONLY: touch devices
'@test'['Check mouse events raised correctly'] = {
    '1.Bind mouse event handlers and call hover': function () {
        var $input1 = $('#input');
        var $input2 = $('#input1');

        eventTracker.track($input1, ['mouseover', 'mouseout']);
        eventTracker.track($input2, ['mouseover', 'mouseover']);

        act.hover($input1);
    },

    '2.Check that handlers were called for first element and call hover for second element': function () {
        if (!browser.hasTouchEvents)
            eq(eventTracker.getCount($('#input'), 'mouseover'), 1);

        act.hover('#input1');
    },

    '3.Check that handlers were called for second element': function () {
        if (!browser.hasTouchEvents) {
            eq(eventTracker.getCount($('#input'), 'mouseout'), 1);
            eq(eventTracker.getCount($('#input1'), 'mouseover'), 2);
        }
    }
};

//ONLY: ie && except touch devices
'@test'['Pointer events test (T191183)'] = {
    'Bind pointer event handlers and call click': function () {
        var input  = $('#input')[0];
        var shared = this;

        shared.events = '';

        function pointerEventHandler (e) {
            shared.events += e.type.toLowerCase().replace('ms', '');
            eq(e.pointerType, browser.version > 10 ? 'mouse' : 4);
            eq(e.button, -1);
            eq(e.buttons, 0);
        }

        if (browser.isIE) {
            if (browser.version > 11) {
                input.onpointermove = pointerEventHandler;
                input.onpointerover = pointerEventHandler;
            }
            else {
                input.onmspointermove = pointerEventHandler;
                input.onmspointerover = pointerEventHandler;
            }
        }

        act.click(input);
    },

    '2.Check that handlers were called': function () {
        if (browser.isIE && !browser.hasTouchEvents) {
            ok(this.events.indexOf('pointermove') > -1);
            ok(this.events.indexOf('pointerover') > -1);
        }
    }
};
