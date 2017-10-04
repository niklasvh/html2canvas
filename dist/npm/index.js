'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _CanvasRenderer = require('./renderer/CanvasRenderer');

var _CanvasRenderer2 = _interopRequireDefault(_CanvasRenderer);

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _Window = require('./Window');

var _Bounds = require('./Bounds');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var html2canvas = function html2canvas(element, conf) {
    // eslint-disable-next-line no-console
    if ((typeof console === 'undefined' ? 'undefined' : _typeof(console)) === 'object' && typeof console.log === 'function') {
        // eslint-disable-next-line no-console
        console.log('html2canvas ' + __VERSION__);
    }

    var config = conf || {};
    var logger = new _Logger2.default();

    var ownerDocument = element.ownerDocument;
    var defaultView = ownerDocument.defaultView;

    var scrollX = defaultView.pageXOffset;
    var scrollY = defaultView.pageYOffset;

    var isDocument = element.tagName === 'HTML' || element.tagName === 'BODY';

    var _ref = isDocument ? (0, _Bounds.parseDocumentSize)(ownerDocument) : (0, _Bounds.parseBounds)(element, scrollX, scrollY),
        width = _ref.width,
        height = _ref.height,
        left = _ref.left,
        top = _ref.top;

    var defaultOptions = {
        async: true,
        allowTaint: false,
        imageTimeout: 15000,
        proxy: null,
        removeContainer: true,
        foreignObjectRendering: true,
        scale: defaultView.devicePixelRatio || 1,
        target: new _CanvasRenderer2.default(config.canvas),
        x: left,
        y: top,
        width: Math.ceil(width),
        height: Math.ceil(height),
        windowWidth: defaultView.innerWidth,
        windowHeight: defaultView.innerHeight,
        scrollX: defaultView.pageXOffset,
        scrollY: defaultView.pageYOffset
    };

    var result = (0, _Window.renderElement)(element, _extends({}, defaultOptions, config), logger);

    if (__DEV__) {
        return result.catch(function (e) {
            logger.error(e);
            throw e;
        });
    }
    return result;
};

html2canvas.CanvasRenderer = _CanvasRenderer2.default;

module.exports = html2canvas;