'@fixture Regression detection element after event simulation';
'@page ./tests/runner/detection-element/regression.html';

'@require :browser';

'@test'['T210448: Unnecessary typing occurs if element was changed after keypress event'] = {
    '1.Wait for input appearance inside iframe': inIFrame('#iframe', function () {
        act.waitFor('input:first');
    }),

    '2.Press symbol and focus iframe\'s input on keypress event': function () {
        var iFrameInput = $('iframe')[0].contentDocument.getElementsByTagName('input')[0];

        iFrameInput.value = '';

        $(document).bind('keypress', function () {
            iFrameInput.focus();
        });

        act.press('f')
    },

    '3.Check iframe\'s input value': inIFrame('#iframe', function () {
        eq($('input')[0].value, browser.isWebKit || browser.isMozilla ? '' : 'f', 'iframe\'s input value is correct');
    })
};
