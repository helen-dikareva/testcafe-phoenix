function removeElement (selector) {
    $(selector).remove();
}

function moveElement (selector, x, y) {
    $(selector).css({
        left: x + 'px',
        top:  y + 'px'
    });
}

function getElementCenter (element) {
    return {
        x: Math.floor(element.offsetLeft + element.offsetWidth / 2),
        y: Math.floor(element.offsetTop + element.offsetHeight / 2)
    };
}

function isInTarget (elementSelector, targetSelector) {
    var elementCenter = getElementCenter($(elementSelector)[0]);
    var targetCenter  = getElementCenter($(targetSelector)[0]);

    return elementCenter.x === targetCenter.x && elementCenter.y === targetCenter.y;
}
