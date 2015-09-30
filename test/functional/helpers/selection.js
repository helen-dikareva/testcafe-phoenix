function set ($el, startSelection, endSelection, inverse) {
    var el            = $el[0];
    var start         = startSelection || 0;
    var end           = endSelection || start;
    var startPosition = inverse ? end : start; //NOTE: set to start position

    el.focus();

    if (el.setSelectionRange)
        el.setSelectionRange(startPosition, startPosition);
    else {
        el.selectionStart = startPosition;
        el.selectionEnd   = startPosition;
    }

    //NOTE: select
    if (el.setSelectionRange)
        el.setSelectionRange(start, end, inverse ? 'backward' : 'forward');
    else {
        el.selectionStart = start;
        el.selectionEnd   = end;
    }
}

var selection = {
    set: set
};
