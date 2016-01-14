import hammerhead from '../../deps/hammerhead';
import testCafeCore from '../../deps/testcafe-core';
import ScrollAutomation from './scroll';
import Cursor from '../cursor';
import { sendRequestToFrame } from '../../utils/iframe';

var Promise = hammerhead.Promise;

var nativeMethods  = hammerhead.nativeMethods;
var browserUtils   = hammerhead.utils.browser;
var extend         = hammerhead.utils.extend;
var eventSimulator = hammerhead.eventSandbox.eventSimulator;
var messageSandbox = hammerhead.eventSandbox.message;
var positionUtils  = testCafeCore.positionUtils;
var domUtils       = testCafeCore.domUtils;
var styleUtils     = testCafeCore.styleUtils;
var eventUtils     = testCafeCore.eventUtils;


const MOVE_REQUEST_CMD  = 'automation|move|request';
const MOVE_RESPONSE_CMD = 'automation|move|response';

// Utils
function whilst (condition, iterator) {
    return new Promise(resolve => {
        function iterate () {
            if (condition())
                return iterator().then(iterate);

            resolve();
        }

        return iterate();
    });
}

function nextTick () {
    return new Promise(resolve => nativeMethods.setTimeout.call(window, resolve, 0));
}

function isInRectangle ({ x, y }, rectangle) {
    return x >= rectangle.left && x <= rectangle.right && y >= rectangle.top && y <= rectangle.bottom;
}

function findLineAndRectangleIntersection (pointStart, pointEnd, rectangle) {
    var points = [];

    var getLineYByXCoord = function (x) {
        if (pointEnd.x - pointStart.x === 0)
            return null;

        return pointStart.y + (x * (pointEnd.y - pointStart.y) + pointStart.x * (pointStart.y - pointEnd.y)) /
                              (pointEnd.x - pointStart.x);
    };

    var getLineXByYCoord = function (y) {
        if (pointEnd.y - pointStart.y === 0)
            return null;

        return pointStart.x + (y * (pointEnd.x - pointStart.x) + pointStart.y * (pointStart.x - pointEnd.x)) /
                              (pointEnd.y - pointStart.y);
    };

    var getDistanceBetweenPoints = function (start, end) {
        return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    };

    var findTransfer = function (coord, isHorizontalSide) {
        var intersection = isHorizontalSide ? getLineXByYCoord(coord) : getLineYByXCoord(coord);
        var hasTransfer  = intersection &&
                           (isHorizontalSide ? intersection >= rectangle.left && intersection <= rectangle.right :
                           intersection >= rectangle.top && intersection <= rectangle.bottom);

        if (hasTransfer) {
            points.push({
                x: isHorizontalSide ? Math.round(intersection) : Math.round(coord),
                y: isHorizontalSide ? Math.round(coord) : Math.round(intersection)
            });
        }
    };

    for (var prop in rectangle) {
        if (rectangle.hasOwnProperty(prop))
            findTransfer(rectangle[prop], /top|bottom/.test(prop));
    }

    return points.length === 1 ||
           getDistanceBetweenPoints(pointStart, points[0]) < getDistanceBetweenPoints(pointStart, points[1]) ?
           points[0] : points[1];
}

// Setup cross-iframe interaction
messageSandbox.on(messageSandbox.SERVICE_MSG_RECEIVED_EVENT, e => {
    if (e.message.cmd === MOVE_REQUEST_CMD) {
        var responseMsg = {
            cmd: MOVE_RESPONSE_CMD
        };

        var intersectionPoint = null;
        var moveAutomation    = null;
        var modifiers         = e.message.modifiers;

        if (window.top === window.self) {
            var iframe      = domUtils.getIframeByWindow(e.source);
            var iframePoint = {
                x: e.message.endX,
                y: e.message.endY
            };

            var iframeBorders = styleUtils.getBordersWidth(iframe);
            var iframePadding = styleUtils.getElementPadding(iframe);

            intersectionPoint = MoveAutomation.getIFrameIntersectionPoint(e.source, iframePoint);

            var iframePointOffsets = {
                offsetX: intersectionPoint.x + iframeBorders.left + iframePadding.left,
                offsetY: intersectionPoint.y + iframeBorders.top + iframePadding.top
            };

            moveAutomation = new MoveAutomation(iframe, iframePointOffsets, { modifiers });
        }
        else {
            var iframeRectangle = {
                left:   e.message.left,
                right:  e.message.right,
                top:    e.message.top,
                bottom: e.message.bottom
            };

            if (!e.message.iframeUnderCursor) {
                var startX = e.message.startX;
                var startY = e.message.startY;

                var clientX = startX - iframeRectangle.left;
                var clientY = startY - iframeRectangle.top;

                eventSimulator.mouseout(lastHoveredElement, { clientX, clientY, relatedTarget: null });
                messageSandbox.sendServiceMsg(responseMsg, e.source);

                return;
            }

            var cursorPosition = Cursor.getPosition();
            var startPoint     = {
                x: iframeRectangle.left + cursorPosition.x,
                y: iframeRectangle.top + cursorPosition.y
            };
            var endPoint       = { x: e.message.endX, y: e.message.endY };

            intersectionPoint = findLineAndRectangleIntersection(startPoint, endPoint, iframeRectangle);

            moveAutomation = new MoveAutomation(document.documentElement, {
                offsetX: intersectionPoint.x - iframeRectangle.left,
                offsetY: intersectionPoint.y - iframeRectangle.top
            }, { modifiers });
        }

        responseMsg.x = intersectionPoint.x;
        responseMsg.y = intersectionPoint.y;

        moveAutomation
            .run()
            .then(() => {
                Cursor.setActiveWindow(e.source);
                messageSandbox.sendServiceMsg(responseMsg, e.source);
            });
    }
});

// Static
var lastHoveredElement = null;


// TODO: dragging, touchevents (tests)
export default class MoveAutomation {
    constructor (element, { offsetX, offsetY }, { speed, minMovingTime, dragMode, modifiers } = {}) {
        this.DEFAULT_SPEED = 1000; // pixes/ms

        this.touchMode = browserUtils.hasTouchEvents;
        this.moveEvent = this.touchMode ? 'touchmove' : 'mousemove';

        this.dragMode    = dragMode;
        this.dragElement = this.dragMode ? Cursor.getElementUnderCursor() : null;

        this.element       = element;
        this.offsetX       = offsetX;
        this.offsetY       = offsetY;
        this.speed         = speed || this.DEFAULT_SPEED;
        this.minMovingTime = minMovingTime || null;
        this.modifiers     = modifiers || {};

        this.endPoint = null;

        // moving state
        this.movingTime = null;
        this.x          = null;
        this.y          = null;
        this.startTime  = null;
        this.endTime    = null;
        this.distanceX  = null;
        this.distanceY  = null;
    }

    static getIFrameIntersectionPoint (iframeWin, iframePoint) {
        //TODO: rename positionUtils.getFixedPosition
        var cursorPosition  = Cursor.getPosition();
        var iframeRectangle = positionUtils.getIFrameClientCoordinates(iframeWin);

        if (isInRectangle(cursorPosition, iframeRectangle)) {
            return {
                x: cursorPosition.x - iframeRectangle.left,
                y: cursorPosition.y - iframeRectangle.top
            };
        }

        var iframePointClientPosition = positionUtils.getFixedPosition(iframePoint, iframeWin);
        var intersectionPoint         = findLineAndRectangleIntersection(cursorPosition, iframePointClientPosition, iframeRectangle);


        return {
            x: intersectionPoint.x - iframeRectangle.left,
            y: intersectionPoint.y - iframeRectangle.top
        };
    }

    _getTargetClientPoint () {
        var scroll = styleUtils.getElementScroll(this.element);

        if (domUtils.isDocumentRootElement(this.element)) {
            return {
                x: this.offsetX - scroll.left,
                y: this.offsetY - scroll.top
            };
        }

        var clientPosition = positionUtils.getClientPosition(this.element);

        return {
            x: clientPosition.x + this.offsetX,
            y: clientPosition.y + this.offsetY
        };
    }

    _emulateEvents () {
        var currentElement = this.dragMode ? this.dragElement : Cursor.getElementUnderCursor();
        var whichButton    = this.dragMode ? eventUtils.WHICH_PARAMETER.leftButton : eventUtils.WHICH_PARAMETER.noButton;
        var button         = this.dragMode ? eventUtils.BUTTONS_PARAMETER.leftButton : eventUtils.BUTTONS_PARAMETER.noButton;

        var eventOptions = {
            clientX: this.x,
            clientY: this.y,
            button:  0,
            which:   browserUtils.isWebKit ? whichButton : 1,
            buttons: button,
            ctrl:    this.modifiers.ctrl,
            alt:     this.modifiers.alt,
            shift:   this.modifiers.shift,
            meta:    this.modifiers.meta
        };

        var currentElementChanged = currentElement !== lastHoveredElement;

        if (currentElementChanged && lastHoveredElement)
            eventSimulator.mouseout(lastHoveredElement, extend({ relatedTarget: currentElement }, eventOptions));

        //NOTE: only in IE a 'mousemove' event is raised before a 'mouseover' one (B236966)
        if (browserUtils.isIE && currentElement)
            eventSimulator[this.moveEvent](currentElement, eventOptions);

        if (currentElementChanged) {
            if (currentElement)
                eventSimulator.mouseover(currentElement, extend({ relatedTarget: lastHoveredElement }, eventOptions));

            lastHoveredElement = currentElement;
        }

        if (!browserUtils.isIE && currentElement)
            eventSimulator[this.moveEvent](currentElement, eventOptions);

        //NOTE: we need add extra 'mousemove' if element was changed  because sometimes
        // client script require several 'mousemove' events for element (T246904)
        if (currentElementChanged && currentElement)
            eventSimulator[this.moveEvent](currentElement, eventOptions);
    }

    _movingStep () {
        if (this.touchMode && !this.dragMode) {
            this.x = this.endPoint.x;
            this.y = this.endPoint.y;
        }
        else if (!this.startTime) {
            this.startTime = nativeMethods.dateNow();
            this.endTime   = this.startTime + this.movingTime;

            // NOTE: mousemove event can't be simulated on the point where the cursor
            // was at the start. Therefore we increase a minimal distance 1 px.
            this.x += this.distanceX > 0 ? 1 : -1;
            this.y += this.distanceY > 0 ? 1 : -1;
        }
        else {
            var currentTime = Math.min(nativeMethods.dateNow(), this.endTime);
            var progress    = (currentTime - this.startTime) / (this.endTime - this.startTime);

            this.x = Math.floor(this.startPoint.x + this.distanceX * progress);
            this.y = Math.floor(this.startPoint.y + this.distanceY * progress);
        }

        return Cursor.move(this.x, this.y)
            .then(() => this._emulateEvents())
            .then(nextTick);
    }

    _isMovingFinished () {
        return this.x === this.endPoint.x && this.y === this.endPoint.y;
    }

    _move () {
        this.distanceX = this.endPoint.x - this.startPoint.x;
        this.distanceY = this.endPoint.y - this.startPoint.y;

        this.movingTime = Math.max(Math.abs(this.distanceX), Math.abs(this.distanceY)) / this.speed;

        if (this.minMovingTime)
            this.movingTime = Math.max(this.movingTime, this.minMovingTime);

        return whilst(() => !this._isMovingFinished(), () => this._movingStep());
    }

    run () {
        return new Promise(resolve => {
            var scrollAutomation = new ScrollAutomation(this.element, { offsetX: this.offsetX, offsetY: this.offsetY });

            return scrollAutomation
                .run()
                .then(() => {
                    var { x, y } = this._getTargetClientPoint();
                    var windowWidth  = styleUtils.getWidth(window);
                    var windowHeight = styleUtils.getHeight(window);

                    if (x < 0 || x > windowWidth || y < 0 || y > windowHeight) {
                        resolve();
                        return;
                    }

                    this.endPoint = { x, y };
                })
                .then(() => {
                    if (!Cursor.isActive()) {
                        var { x, y } = Cursor.getPosition();
                        var activeWindow      = Cursor.getActiveWindow();
                        var iframe            = null;
                        var iframeUnderCursor = null;

                        var iframeRectangle = null;

                        var msg = {
                            cmd:       MOVE_REQUEST_CMD,
                            startX:    x,
                            startY:    y,
                            endX:      this.endPoint.x,
                            endY:      this.endPoint.y,
                            modifiers: this.modifiers
                        };

                        if (window.top === window.self) {
                            iframe          = domUtils.getIframeByWindow(activeWindow);
                            iframeRectangle = positionUtils.getIFrameClientCoordinates(activeWindow);   //TODO: check maybe we should change the argument to iframe
                            iframeUnderCursor = Cursor.getElementUnderCursor() === iframe;

                            msg.left              = iframeRectangle.left;
                            msg.top               = iframeRectangle.top;
                            msg.right             = iframeRectangle.right;
                            msg.bottom            = iframeRectangle.bottom;
                            msg.iframeUnderCursor = iframeUnderCursor;
                        }

                        return sendRequestToFrame(msg, MOVE_RESPONSE_CMD, activeWindow)
                            .then(message => {
                                Cursor.setActiveWindow(window);

                                if (iframeUnderCursor || window.top !== window.self)
                                    return Cursor.move(message.x, message.y);
                            });
                    }
                })
                .then(() => {
                    this.startPoint = Cursor.getPosition();
                    this.x          = this.startPoint.x;
                    this.y          = this.startPoint.y;

                    return this._move();
                })
                .then(resolve);
        });
    }
}
