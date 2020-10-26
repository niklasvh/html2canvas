"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var bounds_1 = require("./css/layout/bounds");
var color_1 = require("./css/types/color");
var parser_1 = require("./css/syntax/parser");
var document_cloner_1 = require("./dom/document-cloner");
var node_parser_1 = require("./dom/node-parser");
var logger_1 = require("./core/logger");
var cache_storage_1 = require("./core/cache-storage");
var canvas_renderer_1 = require("./render/canvas/canvas-renderer");
var foreignobject_renderer_1 = require("./render/canvas/foreignobject-renderer");
var parseColor = function (value) { return color_1.color.parse(parser_1.Parser.create(value).parseComponentValue()); };
var html2canvas = function (element, options) {
    if (options === void 0) { options = {}; }
    return renderElement(element, options);
};
exports.default = html2canvas;
if (typeof window !== 'undefined') {
    cache_storage_1.CacheStorage.setContext(window);
}
var renderElement = function (element, opts) { return __awaiter(_this, void 0, void 0, function () {
    var ownerDocument, defaultView, instanceName, _a, width, height, left, top, defaultResourceOptions, resourceOptions, defaultOptions, options, windowBounds, documentCloner, clonedElement, container, documentBackgroundColor, bodyBackgroundColor, bgColor, defaultBackgroundColor, backgroundColor, renderOptions, canvas, renderer, root, renderer;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                ownerDocument = element.ownerDocument;
                if (!ownerDocument) {
                    throw new Error("Element is not attached to a Document");
                }
                defaultView = ownerDocument.defaultView;
                if (!defaultView) {
                    throw new Error("Document is not attached to a Window");
                }
                instanceName = (Math.round(Math.random() * 1000) + Date.now()).toString(16);
                _a = node_parser_1.isBodyElement(element) || node_parser_1.isHTMLElement(element) ? bounds_1.parseDocumentSize(ownerDocument) : bounds_1.parseBounds(element), width = _a.width, height = _a.height, left = _a.left, top = _a.top;
                defaultResourceOptions = {
                    allowTaint: false,
                    imageTimeout: 15000,
                    proxy: undefined,
                    useCORS: false
                };
                resourceOptions = __assign({}, defaultResourceOptions, opts);
                defaultOptions = {
                    backgroundColor: '#ffffff',
                    cache: opts.cache ? opts.cache : cache_storage_1.CacheStorage.create(instanceName, resourceOptions),
                    logging: true,
                    removeContainer: true,
                    foreignObjectRendering: false,
                    scale: defaultView.devicePixelRatio || 1,
                    windowWidth: defaultView.innerWidth,
                    windowHeight: defaultView.innerHeight,
                    scrollX: defaultView.pageXOffset,
                    scrollY: defaultView.pageYOffset,
                    x: left,
                    y: top,
                    width: Math.ceil(width),
                    height: Math.ceil(height),
                    id: instanceName
                };
                options = __assign({}, defaultOptions, resourceOptions, opts);
                windowBounds = new bounds_1.Bounds(options.scrollX, options.scrollY, options.windowWidth, options.windowHeight);
                logger_1.Logger.create({ id: instanceName, enabled: options.logging });
                logger_1.Logger.getInstance(instanceName).debug("Starting document clone");
                documentCloner = new document_cloner_1.DocumentCloner(element, {
                    id: instanceName,
                    onclone: options.onclone,
                    ignoreElements: options.ignoreElements,
                    inlineImages: options.foreignObjectRendering,
                    copyStyles: options.foreignObjectRendering
                });
                clonedElement = documentCloner.clonedReferenceElement;
                if (!clonedElement) {
                    return [2 /*return*/, Promise.reject("Unable to find element in cloned iframe")];
                }
                return [4 /*yield*/, documentCloner.toIFrame(ownerDocument, windowBounds)];
            case 1:
                container = _b.sent();
                documentBackgroundColor = ownerDocument.documentElement
                    ? parseColor(getComputedStyle(ownerDocument.documentElement).backgroundColor)
                    : color_1.COLORS.TRANSPARENT;
                bodyBackgroundColor = ownerDocument.body
                    ? parseColor(getComputedStyle(ownerDocument.body).backgroundColor)
                    : color_1.COLORS.TRANSPARENT;
                bgColor = opts.backgroundColor;
                defaultBackgroundColor = typeof bgColor === 'string' ? parseColor(bgColor) : bgColor === null ? color_1.COLORS.TRANSPARENT : 0xffffffff;
                backgroundColor = element === ownerDocument.documentElement
                    ? color_1.isTransparent(documentBackgroundColor)
                        ? color_1.isTransparent(bodyBackgroundColor)
                            ? defaultBackgroundColor
                            : bodyBackgroundColor
                        : documentBackgroundColor
                    : defaultBackgroundColor;
                renderOptions = {
                    id: instanceName,
                    cache: options.cache,
                    canvas: options.canvas,
                    backgroundColor: backgroundColor,
                    scale: options.scale,
                    x: options.x,
                    y: options.y,
                    scrollX: options.scrollX,
                    scrollY: options.scrollY,
                    width: options.width,
                    height: options.height,
                    windowWidth: options.windowWidth,
                    windowHeight: options.windowHeight
                };
                if (!options.foreignObjectRendering) return [3 /*break*/, 3];
                logger_1.Logger.getInstance(instanceName).debug("Document cloned, using foreign object rendering");
                renderer = new foreignobject_renderer_1.ForeignObjectRenderer(renderOptions);
                return [4 /*yield*/, renderer.render(clonedElement)];
            case 2:
                canvas = _b.sent();
                return [3 /*break*/, 5];
            case 3:
                logger_1.Logger.getInstance(instanceName).debug("Document cloned, using computed rendering");
                cache_storage_1.CacheStorage.attachInstance(options.cache);
                logger_1.Logger.getInstance(instanceName).debug("Starting DOM parsing");
                root = node_parser_1.parseTree(clonedElement);
                cache_storage_1.CacheStorage.detachInstance();
                if (backgroundColor === root.styles.backgroundColor) {
                    root.styles.backgroundColor = color_1.COLORS.TRANSPARENT;
                }
                logger_1.Logger.getInstance(instanceName).debug("Starting renderer");
                renderer = new canvas_renderer_1.CanvasRenderer(renderOptions);
                return [4 /*yield*/, renderer.render(root)];
            case 4:
                canvas = _b.sent();
                _b.label = 5;
            case 5:
                if (options.removeContainer === true) {
                    if (!document_cloner_1.DocumentCloner.destroy(container)) {
                        logger_1.Logger.getInstance(instanceName).error("Cannot detach cloned iframe as it is not in the DOM anymore");
                    }
                }
                logger_1.Logger.getInstance(instanceName).debug("Finished rendering");
                logger_1.Logger.destroy(instanceName);
                cache_storage_1.CacheStorage.destroy(instanceName);
                return [2 /*return*/, canvas];
        }
    });
}); };
//# sourceMappingURL=index.js.map