'@fixture regression hover';
'@page ./tests/runner/api/hover/index.html';

'@require :eventTracker';
'@require :browser';

//ONLY: touch devices
'@test'['T188166 - act.hover trigger "mouseenter" event with "which" parameter 1'] = {
    '1.Bind handlers and call hover': function () {
        var $input = $('#input');
        var shared = this;

        shared.events = [];

        $input.on('mouseover mouseenter', function (e) {
            shared.events.push(e.type);

            eq(e.which, browser.isWebKit ? 0 : 1);
            eq(e.originalEvent.which, browser.isWebKit ? 0 : 1);

            eq(e.button, 0);
            if (browser.isIE || browser.isMozilla)
                eq(e.buttons, 0);
        });

        act.hover($input);
    },

    '2.Check that handlers were called': function () {
        var $input = $('#input');

        if (!browser.hasTouchEvents)
            eq(this.events, ['mouseover', 'mouseenter'])
    }
};

//ONLY: touch devices
'@test'['T214458 - The Hover action does not allow specifying mouse action options thus being inconsistent with other actions'] = {
    '1.Bind handler and call hover with special options': function () {
        var $input = $('#input');
        var shared = this;

        shared.actionOffset = 10;

        $input.mousemove(function (e) {
            shared.pageX = e.pageX;
            shared.pageY = e.pageY;
            shared.shiftKey = e.shiftKey;
        });

        act.hover($input, {shift: true, offsetX: shared.actionOffset, offsetY: shared.actionOffset});
    },

    '2.Check hover event options': function () {
        var elementOffset = $('#input').offset();

        eq(this.pageX, elementOffset.left + this.actionOffset);
        eq(this.pageY, elementOffset.top + this.actionOffset);
        ok(this.shiftKey);
    }
};
