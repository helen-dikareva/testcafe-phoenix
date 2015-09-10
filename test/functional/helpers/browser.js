var userAgent = window.navigator.userAgent.toLowerCase();
var isIE11    = !!(navigator.appCodeName === 'Mozilla' && /trident\/7.0/.test(userAgent));
var isIOS     = /(iphone|ipod|ipad)/.test(userAgent);
var isSafari  = isIOS || /safari/.test(userAgent) && !/chrome/.test(userAgent);
var isMSEdge  = !!/edge\//.test(userAgent);

/*eslint-disable no-unused-vars */
var browser = {
    hasTouchEvents: !!('ontouchstart' in window),
    isIE:           !!$.browser.msie || isIE11,
    isIE11:         isIE11,
    isMozilla:      !!$.browser.mozilla && !isIE11,
    isWebKit:       /webkit/.test(userAgent) && !isSafari && !isMSEdge,
    version:        parseInt($.browser.version, 10)
};
/*eslint-enable no-unused-vars */
