'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.renderElement = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _NodeParser = require('./NodeParser');

var _Renderer = require('./Renderer');

var _Renderer2 = _interopRequireDefault(_Renderer);

var _ForeignObjectRenderer = require('./renderer/ForeignObjectRenderer');

var _ForeignObjectRenderer2 = _interopRequireDefault(_ForeignObjectRenderer);

var _Feature = require('./Feature');

var _Feature2 = _interopRequireDefault(_Feature);

var _Bounds = require('./Bounds');

var _Clone = require('./Clone');

var _Font = require('./Font');

var _Color = require('./Color');

var _Color2 = _interopRequireDefault(_Color);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderElement = exports.renderElement = function renderElement(element, options, logger) {
    var ownerDocument = element.ownerDocument;

    var windowBounds = new _Bounds.Bounds(options.scrollX, options.scrollY, options.windowWidth, options.windowHeight);

    // http://www.w3.org/TR/css3-background/#special-backgrounds
    var documentBackgroundColor = ownerDocument.documentElement ? new _Color2.default(getComputedStyle(ownerDocument.documentElement).backgroundColor) : _Color.TRANSPARENT;
    var bodyBackgroundColor = ownerDocument.body ? new _Color2.default(getComputedStyle(ownerDocument.body).backgroundColor) : _Color.TRANSPARENT;

    var backgroundColor = element === ownerDocument.documentElement ? documentBackgroundColor.isTransparent() ? bodyBackgroundColor.isTransparent() ? options.backgroundColor ? new _Color2.default(options.backgroundColor) : null : bodyBackgroundColor : documentBackgroundColor : options.backgroundColor ? new _Color2.default(options.backgroundColor) : null;

    return (options.foreignObjectRendering ? // $FlowFixMe
    _Feature2.default.SUPPORT_FOREIGNOBJECT_DRAWING : Promise.resolve(false)).then(function (supportForeignObject) {
        return supportForeignObject ? function (cloner) {
            if (__DEV__) {
                logger.log('Document cloned, using foreignObject rendering');
            }

            return cloner.imageLoader.ready().then(function () {
                var renderer = new _ForeignObjectRenderer2.default(cloner.clonedReferenceElement);
                return renderer.render({
                    backgroundColor: backgroundColor,
                    logger: logger,
                    scale: options.scale,
                    x: options.x,
                    y: options.y,
                    width: options.width,
                    height: options.height,
                    windowWidth: options.windowWidth,
                    windowHeight: options.windowHeight,
                    scrollX: options.scrollX,
                    scrollY: options.scrollY
                });
            });
        }(new _Clone.DocumentCloner(element, options, logger, true, renderElement)) : (0, _Clone.cloneWindow)(ownerDocument, windowBounds, element, options, logger, renderElement).then(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 3),
                container = _ref2[0],
                clonedElement = _ref2[1],
                imageLoader = _ref2[2];

            if (__DEV__) {
                logger.log('Document cloned, using computed rendering');
            }

            var stack = (0, _NodeParser.NodeParser)(clonedElement, imageLoader, logger);
            var clonedDocument = clonedElement.ownerDocument;

            if (backgroundColor === stack.container.style.background.backgroundColor) {
                stack.container.style.background.backgroundColor = _Color.TRANSPARENT;
            }

            return imageLoader.ready().then(function (imageStore) {
                if (options.removeContainer === true) {
                    if (container.parentNode) {
                        container.parentNode.removeChild(container);
                    } else if (__DEV__) {
                        logger.log('Cannot detach cloned iframe as it is not in the DOM anymore');
                    }
                }

                var fontMetrics = new _Font.FontMetrics(clonedDocument);
                if (__DEV__) {
                    logger.log('Starting renderer');
                }

                var renderOptions = {
                    backgroundColor: backgroundColor,
                    fontMetrics: fontMetrics,
                    imageStore: imageStore,
                    logger: logger,
                    scale: options.scale,
                    x: options.x,
                    y: options.y,
                    width: options.width,
                    height: options.height
                };

                if (Array.isArray(options.target)) {
                    return Promise.all(options.target.map(function (target) {
                        var renderer = new _Renderer2.default(target, renderOptions);
                        return renderer.render(stack);
                    }));
                } else {
                    var renderer = new _Renderer2.default(options.target, renderOptions);
                    return renderer.render(stack);
                }
            });
        });
    });
};