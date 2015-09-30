'@fixture element availability waiting';
'@page ./tests/runner/element-waiting/index.html';

var $invisibleElement = null;

'@test'['Waiting for invisible element'] = {
    '1.Set timeout for making element visible and click on invisible element': function () {
        var $input = $('<input>')
            .css('display', 'none')
            .appendTo('body');
        var shared = this;

        $input.click(function () {
            shared.clickRaised = true;
        });

        makeElementVisibleAfterTimeout($input);

        act.click($input);
    },

    '2.Check element clicked': function () {
        ok(this.clickRaised);
    }
};

'@test'['Waiting for element is not exist on the start'] = {
    '1.Click on element from jQuery selector argument is not exist on the start': function () {
        this.inputId = 'input';

        createElementAfterTimeout(this.inputId, this);

        act.click('#' + this.inputId);
    },

    '2.Check element clicked': function () {
        ok(this.clickRaised);

        $('input').remove();
        $invisibleElement = null;
    },

    '3.Click on element from function argument is not exist on the start': function () {
        eq($('#' + this.inputId).length, 0);

        createElementAfterTimeout(this.inputId, this);

        act.click(function () {
            return $invisibleElement;
        });
    },

    '4.Check element clicked': function () {
        ok(this.clickRaised);

        $('input').remove();
        $invisibleElement = null;
    },

    '5.Click on element from array argument is not exist on the start': function () {
        var $input1 = $('<input />').appendTo('body');

        eq($('#' + this.inputId).length, 0);

        createElementAfterTimeout(this.inputId, this);

        act.click([$input1, '#' + this.inputId]);
    },

    '6.Check element clicked': function () {
        ok(this.clickRaised);

        $('input').remove();
        $invisibleElement = null;
    },

    '7.Click on element from function argument returns empty jQuery object': function () {
        var shared = this;

        eq($('#' + this.inputId).length, 0);

        createElementAfterTimeout(this.inputId, this);

        act.click(function () {
            return $('#' + shared.inputId);
        });
    },

    '8.Check element clicked': function () {
        ok(this.clickRaised);
    }
};

//utils
function makeElementVisibleAfterTimeout ($el) {
    window.setTimeout(function () {
        $el.css('display', '');
    }, 1000);
}

function createElementAfterTimeout (id, shared) {
    window.setTimeout(function () {
        var $input = $('<input />')
            .attr('id', id)
            .appendTo('body');

        $input.click(function () {
            shared.clickRaised = true;
        });

        $invisibleElement = $input;
    }, 1000);
}
