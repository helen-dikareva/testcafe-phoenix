import hammerhead from './deps/hammerhead';

import * as cursorOld from './cursor-old';
import * as selectElement from './select-element';
import * as modalBackground from './modal-background';
import ProgressPanel from './progress-panel';
import CursorUI from './cursor';
import IframeCursorUI from './cursor/iframe-cursor';

exports.cursorOld       = cursorOld; //obsoleted
exports.CursorUI        = CursorUI;
exports.IframeCursorUI  = IframeCursorUI;
exports.selectElement   = selectElement;
exports.modalBackground = modalBackground;
exports.ProgressPanel   = ProgressPanel;

exports.get = require;

Object.defineProperty(window, '%testCafeUI%', {
    enumerable:   false,
    configurable: false,
    writable:     false,
    value:        exports
});

hammerhead.on(hammerhead.EVENTS.iframeReadyToInit, e => initTestCafeUI(e.iframe.contentWindow, true));
