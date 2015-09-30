function preventDefault (e) {
    var ev = e || window.event;
    if (ev.preventDefault)
        ev.preventDefault();
    else
        ev.returnValue = false;
}

var event = {
    preventDefault: preventDefault
};
