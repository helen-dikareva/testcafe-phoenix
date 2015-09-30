'@fixture drag';
'@page ./tests/runner/api/drag/index.html';

'@require ./helper.js';

'@test'['Call drag with different arguments'] = {
    '1.Call drag with a dom element as a first argument': function () {
        act.drag($('#drag')[0], $('#target')[0]);
    },

    '2.Check drag action result and call drag with startOffset': function () {
        ok(isInTarget('#drag', '#target'), 'element is in the target');
        moveElement('#drag', 0, 0);

        act.drag($('#drag')[0], $('#target'), { offsetX: 40, offsetY: 40 });
    },

    '3.Check drag action result and call drag with domElements array as first argument': function () {
        ok(isInTarget('#drag', '#target'), 'element is in the target');
        moveElement('#drag', 0, 0);

        act.drag([$('#drag')[0], $('#drag1')[0]], $('#target'));
    },

    '4.Check drag action result and call drag with a jQuery object with two elements as first argument': function () {
        ok(isInTarget('#drag', '#target'), 'first element is in the target');
        ok(isInTarget('#drag1', '#target'), 'second element is in the target');

        moveElement('#drag', 0, 0);
        moveElement('#drag1', 100, 300);

        act.drag($('#drag, #drag1'), $('#target'));
    },

    '5.Check drag action result and call drag with jQuery objects as arguments': function () {
        ok(isInTarget('#drag', '#target'), 'first element is in the target');
        ok(isInTarget('#drag1', '#target'), 'second element is in the target');

        moveElement('#drag', 0, 0);
        removeElement('#drag1');

        act.drag($('#drag'), $('#target'));
    },

    '6.Check drag action result and call drag with a jQuery object with several elements as a second argument (drop to first)': function () {
        ok(isInTarget('#drag', '#target'), 'element is in the target');

        moveElement('#drag', 0, 0);

        act.drag('#drag', $('#target, #target1'));
    },

    '7.Check drag action result and call drag with x and y coordinates as second and third arguments': function () {
        ok(isInTarget('#drag', '#target'), 'first element is in the target');

        moveElement('#drag', 0, 0);

        act.drag('#drag', 110, 110);
    },

    '8.Check drag action result and call drag with x and y coordinates as second and third arguments with offsets': function () {
        ok(isInTarget('#drag', '#target'), 'element is in the target');

        moveElement('#drag', 0, 0);

        act.drag('#drag', 150, 150, { offsetX: 10, offsetY: 10 });
    },

    '9.Check drag action result': function () {
        ok(isInTarget('#drag', '#target'), 'first element is in the target');
    }
};

'@test'['Drag with scrolling'] = {
    '1.Drag with scrolling down': function () {
        moveElement('#drag', 500, 500);
        moveElement('#target', 600, 1200);

        act.drag($('#drag'), $('#target'));
    },

    '2.Check drag action result and call drag with scroll up': function () {
        ok(isInTarget('#drag', '#target'), 'element is in the target');

        moveElement('#drag', 100, 1300);
        moveElement('#target', 100, 200);

        act.drag($('#drag'), $('#target'));
    },

    '3.Check drag action result': function () {
        ok(isInTarget('#drag', '#target'), 'element is in the target');
    }
};

'@test'['Overlapping during dragging'] = {
    '1.Drag under different target': function () {
        moveElement('#drag', 100, 100);
        moveElement('#target', 500, 500);
        moveElement('#target1', 300, 300);

        $('#target1').css('zIndex', '100');

        act.drag($('#drag'), $('#target'));
    },

    '2.Check drag action result': function () {
        ok(isInTarget('#drag', '#target'), 'element is in the target');
    }
};

