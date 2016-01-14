import hammerhead from './../deps/hammerhead';
import testCafeCore from './../deps/testcafe-core';
import CURSOR_UI_MESSAGES from './messages';


var Promise        = hammerhead.Promise;
var shadowUI       = hammerhead.shadowUI;
var browserUtils   = hammerhead.utils.browser;
var messageSandbox = hammerhead.eventSandbox.message;

var styleUtils    = testCafeCore.styleUtils;
var positionUtils = testCafeCore.positionUtils;
var eventUtils    = testCafeCore.eventUtils;

const CURSOR_CLASS       = 'cursor';
const TOUCH_CLASS        = 'touch';
const L_MOUSE_DOWN_CLASS = 'l-mouse-down';
const R_MOUSE_DOWN_CLASS = 'r-mouse-down';
const STATE_CLASSES      = [L_MOUSE_DOWN_CLASS, R_MOUSE_DOWN_CLASS].join(' ');

var cursorElement  = null;
var x              = 50;
var y              = 50;
var pointerOffsetX = 0;
var pointerOffsetY = 0;

// Setup cross-iframe interaction
messageSandbox.on(messageSandbox.SERVICE_MSG_RECEIVED_EVENT, e => {
    var msg = e.message;

    switch (msg.cmd) {
        case CURSOR_UI_MESSAGES.moveRequest:
            var position = positionUtils.getFixedPosition({ x: msg.x, y: msg.y }, e.source);

            CursorUI.move(position.x, position.y)
                .then(() => messageSandbox.sendServiceMsg({ cmd: CURSOR_UI_MESSAGES.moveResponse }, e.source));
            break;

        case CURSOR_UI_MESSAGES.leftButtonDownRequest:
            CursorUI.leftButtonDown()
                .then(() => messageSandbox.sendServiceMsg({ cmd: CURSOR_UI_MESSAGES.leftButtonDownResponse }, e.source));
            break;
        case CURSOR_UI_MESSAGES.rightButtonDownRequest:
            CursorUI.rightButtonDown()
                .then(() => messageSandbox.sendServiceMsg({ cmd: CURSOR_UI_MESSAGES.rightButtonDownResponse }, e.source));
            break;
        case CURSOR_UI_MESSAGES.buttonUpRequest:
            CursorUI.buttonUp()
                .then(() => messageSandbox.sendServiceMsg({ cmd: CURSOR_UI_MESSAGES.buttonUpResponse }, e.source));
            break;
    }
});

export default class CursorUI {
    static create () {
        cursorElement = document.createElement('div');
        shadowUI.addClass(cursorElement, CURSOR_CLASS);

        // NOTE: For IE in Cross domain iframe we can't use touch cursor
        // because we won't be able to get element under cursor
        if (browserUtils.isTouchDevice && !browserUtils.isIE) {
            shadowUI.addClass(this.cursorElement, TOUCH_CLASS);

            // NOTE: in touch mode pointer should be in the center of the cursor
            pointerOffsetX = Math.ceil(styleUtils.getWidth(cursorElement) / 2);
            pointerOffsetY = Math.ceil(styleUtils.getHeight(cursorElement) / 2);
        }

        shadowUI.getRoot().appendChild(cursorElement);

        eventUtils.bind(window, 'scroll', () => CursorUI.move({ x, y }));
    }

    static isVisible () {
        return cursorElement && styleUtils.get(cursorElement, 'visibility') !== 'hidden';
    }

    static hide () {
        if (!cursorElement)
            CursorUI.create();

        styleUtils.set(cursorElement, 'visibility', 'hidden');
    }

    static show () {
        if (!cursorElement)
            CursorUI.create();

        styleUtils.set(cursorElement, 'visibility', '');
    }

    static move (newX, newY) {
        x = newX;
        y = newY;

        if (!cursorElement)
            CursorUI.create();

        styleUtils.set(cursorElement, {
            left: x + styleUtils.getScrollLeft(document) - pointerOffsetX + 'px',
            top:  y + styleUtils.getScrollTop(document) - pointerOffsetY + 'px'
        });

        return Promise.resolve();
    }

    static leftButtonDown () {
        if (!cursorElement)
            CursorUI.create();

        shadowUI.removeClass(cursorElement, STATE_CLASSES);
        shadowUI.addClass(cursorElement, L_MOUSE_DOWN_CLASS);

        return Promise.resolve();
    }

    static rightButtonDown () {
        if (!cursorElement)
            CursorUI.create();

        shadowUI.removeClass(cursorElement, STATE_CLASSES);
        shadowUI.addClass(cursorElement, R_MOUSE_DOWN_CLASS);

        return Promise.resolve();
    }

    static buttonUp () {
        if (!cursorElement)
            CursorUI.create();

        shadowUI.removeClass(cursorElement, STATE_CLASSES);

        return Promise.resolve();
    }
}
