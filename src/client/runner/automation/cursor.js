import testCafeCore from '../deps/testcafe-core';

var positionUtils = testCafeCore.positionUtils;
var domUtils      = testCafeCore.domUtils;

//Static
var x                   = 50;
var y                   = 50;
var currentActiveWindow = window.top;

export default class Cursor {
    static _ensureActiveWindow () {
        if (currentActiveWindow === window || currentActiveWindow === window.parent)
            return;

        var activeFrame = domUtils.getIframeByWindow(currentActiveWindow);

        if (!activeFrame || !domUtils.isElementInDocument(activeFrame))
            currentActiveWindow = window;
    }

    static getPosition () {
        return { x, y };
    }

    static move (newX, newY) {
        x = newX;
        y = newY;
    }

    static getElementUnderCursor () {
        return positionUtils.getElementFromPoint(x, y, document, true);
    }

    static isActive () {
        Cursor._ensureActiveWindow();
        return currentActiveWindow === window;
    }

    static setActiveWindow (win) {
        currentActiveWindow = win;
    }

    static getActiveWindow () {
        Cursor._ensureActiveWindow();
        return currentActiveWindow;
    }
}
