import testCafeCore from '../deps/testcafe-core';
import testCafeUI from '../deps/testcafe-ui';


var positionUtils = testCafeCore.positionUtils;
var domUtils      = testCafeCore.domUtils;

var CursorUI = window.top === window.self ? testCafeUI.CursorUI : testCafeUI.IframeCursorUI;

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

    static getPosition () {
        return { x, y };
    }

    static getElementUnderCursor () {
        var isCursorVisible = window.top === window.self && CursorUI.isVisible();

        if (isCursorVisible)
            CursorUI.hide();

        var element = positionUtils.getElementFromPoint(x, y, document, true);

        if (isCursorVisible)
            CursorUI.show();

        return element;
    }

    static move (newX, newY) {
        x = newX;
        y = newY;

        return CursorUI.move(x, y);
    }

    static leftButtonDown () {
        return CursorUI.leftButtonDown();
    }

    static rightButtonDown () {
        return CursorUI.leftButtonDown();
    }

    static buttonUp () {
        return CursorUI.buttonUp();
    }
}
