import hammerhead from './../deps/hammerhead';
import CURSOR_UI_MESSAGES from './messages';
import { sendRequestToFrame } from '../../runner/utils/iframe';

var browserUtils = hammerhead.utils.browser;

//HACK: we can't get element under cursor in cross-domain iframe in IE without hide cursor.
//Instead make 'getElement' method asynchronous, we set cursor to position by one pixel farther.
const RECOGNITION_INCREMENT = browserUtils.isIE ? 1 : 0;

export default class IframeCursorUI {
    static move (x, y) {
        var msg = {
            cmd: CURSOR_UI_MESSAGES.moveRequest,
            x:   x + RECOGNITION_INCREMENT,
            y:   y + RECOGNITION_INCREMENT
        };

        return sendRequestToFrame(msg, CURSOR_UI_MESSAGES.moveResponse, window.top);
    }

    static leftButtonDown () {
        return sendRequestToFrame({
            cmd: CURSOR_UI_MESSAGES.leftButtonDownRequest
        }, CURSOR_UI_MESSAGES.leftButtonDownResponse, window.top);
    }

    static rightButtonDown () {
        return sendRequestToFrame({
            cmd: CURSOR_UI_MESSAGES.rightButtonDownRequest
        }, CURSOR_UI_MESSAGES.rightButtonDownResponse, window.top);
    }

    static buttonUp () {
        return sendRequestToFrame({
            cmd: CURSOR_UI_MESSAGES.buttonUpRequest
        }, CURSOR_UI_MESSAGES.buttonUpResponse, window.top);
    }
}
