'@mixin'['Check element state'] = {
    'a.Check': function () {
        var element          = $(this.selector)[0];
        var activeElement    = document.activeElement;
        var selectionEnd     = this.expectedEnd || this.expectedStart;
        var inverseSelection = hasInverseSelection(activeElement);

        eq(activeElement, element, 'active element are correct');

        if (typeof this.expectedValue !== 'undefined')
            eq(activeElement.value, this.expectedValue, 'active element value are correct');

        eq(activeElement.selectionStart, this.expectedStart, 'active element selection start are correct');
        eq(activeElement.selectionEnd, selectionEnd, 'active element selection end are correct');
        eq(inverseSelection, typeof this.expectedInverse === 'undefined' ? false : this.expectedInverse);
    }
};

//utils
function hasInverseSelection (el) {
    return (el.selectionDirection || el.dataset.selectionDirection) === 'backward';
}
