'@fixture regression drag';
'@page ./tests/runner/api/drag/index.html';

'@require ./helper.js';

'@test'['B236553 - The act.drag() function hangs the test when offsetX or offsetY parameters are passed'] = {
    '1.Drag with fractional offset': function () {
        moveElement('#target', 50, 50);

        act.drag($('#drag'), $('#target'), {offsetX: 10.2, offsetY: 10.6});
    },

    '2.Check drag action result': function () {
        ok(isInTarget('#drag', '#target'), 'element is in the target');
    }
};

'@test'['B253930 - Wrong playback of drag action in IE9'] = {
    '1.Call drag action': function () {
        var $draggable = $('#drag2').css('display', '');

        act.drag($draggable, 110, 110);
    },

    '2.Check drag action result': function () {
        ok(isInTarget('#drag2', '#target'), 'element is in the target');
    }
};
