"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasRenderer = void 0;
var stacking_context_1 = require("../stacking-context");
var color_1 = require("../../css/types/color");
var path_1 = require("../path");
var bound_curves_1 = require("../bound-curves");
var bezier_curve_1 = require("../bezier-curve");
var vector_1 = require("../vector");
var image_1 = require("../../css/types/image");
var border_1 = require("../border");
var background_1 = require("../background");
var parser_1 = require("../../css/syntax/parser");
var text_1 = require("../../css/layout/text");
var image_element_container_1 = require("../../dom/replaced-elements/image-element-container");
var box_sizing_1 = require("../box-sizing");
var canvas_element_container_1 = require("../../dom/replaced-elements/canvas-element-container");
var svg_element_container_1 = require("../../dom/replaced-elements/svg-element-container");
var effects_1 = require("../effects");
var bitwise_1 = require("../../core/bitwise");
var gradient_1 = require("../../css/types/functions/gradient");
var length_percentage_1 = require("../../css/types/length-percentage");
var font_metrics_1 = require("../font-metrics");
var bounds_1 = require("../../css/layout/bounds");
var line_height_1 = require("../../css/property-descriptors/line-height");
var input_element_container_1 = require("../../dom/replaced-elements/input-element-container");
var textarea_element_container_1 = require("../../dom/elements/textarea-element-container");
var select_element_container_1 = require("../../dom/elements/select-element-container");
var iframe_element_container_1 = require("../../dom/replaced-elements/iframe-element-container");
var renderer_1 = require("../renderer");
var MASK_OFFSET = 10000;
var CanvasRenderer = /** @class */ (function (_super) {
    __extends(CanvasRenderer, _super);
    function CanvasRenderer(context, options) {
        var _this = _super.call(this, context, options) || this;
        _this._activeEffects = [];
        _this.canvas = options.canvas ? options.canvas : document.createElement('canvas');
        _this.ctx = _this.canvas.getContext('2d');
        if (!options.canvas) {
            _this.canvas.width = Math.floor(options.width * options.scale);
            _this.canvas.height = Math.floor(options.height * options.scale);
            _this.canvas.style.width = options.width + "px";
            _this.canvas.style.height = options.height + "px";
        }
        _this.fontMetrics = new font_metrics_1.FontMetrics(document);
        _this.ctx.scale(_this.options.scale, _this.options.scale);
        _this.ctx.translate(-options.x, -options.y);
        _this.ctx.textBaseline = 'bottom';
        _this._activeEffects = [];
        _this.context.logger.debug("Canvas renderer initialized (" + options.width + "x" + options.height + ") with scale " + options.scale);
        return _this;
    }
    CanvasRenderer.prototype.applyEffects = function (effects) {
        var _this = this;
        while (this._activeEffects.length) {
            this.popEffect();
        }
        effects.forEach(function (effect) { return _this.applyEffect(effect); });
    };
    CanvasRenderer.prototype.applyEffect = function (effect) {
        this.ctx.save();
        if (effects_1.isOpacityEffect(effect)) {
            this.ctx.globalAlpha = effect.opacity;
        }
        if (effects_1.isTransformEffect(effect)) {
            this.ctx.translate(effect.offsetX, effect.offsetY);
            this.ctx.transform(effect.matrix[0], effect.matrix[1], effect.matrix[2], effect.matrix[3], effect.matrix[4], effect.matrix[5]);
            this.ctx.translate(-effect.offsetX, -effect.offsetY);
        }
        if (effects_1.isClipEffect(effect)) {
            this.path(effect.path);
            this.ctx.clip();
        }
        this._activeEffects.push(effect);
    };
    CanvasRenderer.prototype.popEffect = function () {
        this._activeEffects.pop();
        this.ctx.restore();
    };
    CanvasRenderer.prototype.renderStack = function (stack) {
        return __awaiter(this, void 0, void 0, function () {
            var styles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        styles = stack.element.container.styles;
                        if (!styles.isVisible()) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.renderStackContent(stack)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    CanvasRenderer.prototype.renderNode = function (paint) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (bitwise_1.contains(paint.container.flags, 16 /* DEBUG_RENDER */)) {
                            debugger;
                        }
                        if (!paint.container.styles.isVisible()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.renderNodeBackgroundAndBorders(paint)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.renderNodeContent(paint)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CanvasRenderer.prototype.renderTextWithLetterSpacing = function (text, letterSpacing, baseline) {
        var _this = this;
        if (letterSpacing === 0) {
            this.ctx.fillText(text.text, text.bounds.left, text.bounds.top + baseline);
        }
        else {
            var letters = text_1.segmentGraphemes(text.text);
            letters.reduce(function (left, letter) {
                _this.ctx.fillText(letter, left, text.bounds.top + baseline);
                return left + _this.ctx.measureText(letter).width;
            }, text.bounds.left);
        }
    };
    CanvasRenderer.prototype.createFontStyle = function (styles) {
        var fontVariant = styles.fontVariant
            .filter(function (variant) { return variant === 'normal' || variant === 'small-caps'; })
            .join('');
        var fontFamily = fixIOSSystemFonts(styles.fontFamily).join(', ');
        var fontSize = parser_1.isDimensionToken(styles.fontSize)
            ? "" + styles.fontSize.number + styles.fontSize.unit
            : styles.fontSize.number + "px";
        return [
            [styles.fontStyle, fontVariant, styles.fontWeight, fontSize, fontFamily].join(' '),
            fontFamily,
            fontSize
        ];
    };
    CanvasRenderer.prototype.renderTextNode = function (text, styles) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, font, fontFamily, fontSize, _b, baseline, middle, paintOrder;
            var _this = this;
            return __generator(this, function (_c) {
                _a = this.createFontStyle(styles), font = _a[0], fontFamily = _a[1], fontSize = _a[2];
                this.ctx.font = font;
                this.ctx.direction = styles.direction === 1 /* RTL */ ? 'rtl' : 'ltr';
                this.ctx.textAlign = 'left';
                this.ctx.textBaseline = 'alphabetic';
                _b = this.fontMetrics.getMetrics(fontFamily, fontSize), baseline = _b.baseline, middle = _b.middle;
                paintOrder = styles.paintOrder;
                text.textBounds.forEach(function (text) {
                    paintOrder.forEach(function (paintOrderLayer) {
                        switch (paintOrderLayer) {
                            case 0 /* FILL */:
                                _this.ctx.fillStyle = color_1.asString(styles.color);
                                _this.renderTextWithLetterSpacing(text, styles.letterSpacing, baseline);
                                var textShadows = styles.textShadow;
                                if (textShadows.length && text.text.trim().length) {
                                    textShadows
                                        .slice(0)
                                        .reverse()
                                        .forEach(function (textShadow) {
                                        _this.ctx.shadowColor = color_1.asString(textShadow.color);
                                        _this.ctx.shadowOffsetX = textShadow.offsetX.number * _this.options.scale;
                                        _this.ctx.shadowOffsetY = textShadow.offsetY.number * _this.options.scale;
                                        _this.ctx.shadowBlur = textShadow.blur.number;
                                        _this.renderTextWithLetterSpacing(text, styles.letterSpacing, baseline);
                                    });
                                    _this.ctx.shadowColor = '';
                                    _this.ctx.shadowOffsetX = 0;
                                    _this.ctx.shadowOffsetY = 0;
                                    _this.ctx.shadowBlur = 0;
                                }
                                if (styles.textDecorationLine.length) {
                                    _this.ctx.fillStyle = color_1.asString(styles.textDecorationColor || styles.color);
                                    styles.textDecorationLine.forEach(function (textDecorationLine) {
                                        switch (textDecorationLine) {
                                            case 1 /* UNDERLINE */:
                                                // Draws a line at the baseline of the font
                                                // TODO As some browsers display the line as more than 1px if the font-size is big,
                                                // need to take that into account both in position and size
                                                _this.ctx.fillRect(text.bounds.left, Math.round(text.bounds.top + baseline), text.bounds.width, 1);
                                                break;
                                            case 2 /* OVERLINE */:
                                                _this.ctx.fillRect(text.bounds.left, Math.round(text.bounds.top), text.bounds.width, 1);
                                                break;
                                            case 3 /* LINE_THROUGH */:
                                                // TODO try and find exact position for line-through
                                                _this.ctx.fillRect(text.bounds.left, Math.ceil(text.bounds.top + middle), text.bounds.width, 1);
                                                break;
                                        }
                                    });
                                }
                                break;
                            case 1 /* STROKE */:
                                if (styles.webkitTextStrokeWidth && text.text.trim().length) {
                                    _this.ctx.strokeStyle = color_1.asString(styles.webkitTextStrokeColor);
                                    _this.ctx.lineWidth = styles.webkitTextStrokeWidth;
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    _this.ctx.lineJoin = !!window.chrome ? 'miter' : 'round';
                                    _this.ctx.strokeText(text.text, text.bounds.left, text.bounds.top + baseline);
                                }
                                _this.ctx.strokeStyle = '';
                                _this.ctx.lineWidth = 0;
                                _this.ctx.lineJoin = 'miter';
                                break;
                        }
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    CanvasRenderer.prototype.renderReplacedElement = function (container, curves, image) {
        if (image && container.intrinsicWidth > 0 && container.intrinsicHeight > 0) {
            var box = box_sizing_1.contentBox(container);
            var path = bound_curves_1.calculatePaddingBoxPath(curves);
            this.path(path);
            this.ctx.save();
            this.ctx.clip();
            this.ctx.drawImage(image, 0, 0, container.intrinsicWidth, container.intrinsicHeight, box.left, box.top, box.width, box.height);
            this.ctx.restore();
        }
    };
    CanvasRenderer.prototype.renderNodeContent = function (paint) {
        return __awaiter(this, void 0, void 0, function () {
            var container, curves, styles, _i, _a, child, image, e_1, image, e_2, iframeRenderer, canvas, size, _b, fontFamily, fontSize, baseline, bounds, x, textBounds, img, image, url, e_3, fontFamily, bounds;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.applyEffects(paint.getEffects(4 /* CONTENT */));
                        container = paint.container;
                        curves = paint.curves;
                        styles = container.styles;
                        _i = 0, _a = container.textNodes;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        child = _a[_i];
                        return [4 /*yield*/, this.renderTextNode(child, styles)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (!(container instanceof image_element_container_1.ImageElementContainer)) return [3 /*break*/, 8];
                        _c.label = 5;
                    case 5:
                        _c.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.context.cache.match(container.src)];
                    case 6:
                        image = _c.sent();
                        this.renderReplacedElement(container, curves, image);
                        return [3 /*break*/, 8];
                    case 7:
                        e_1 = _c.sent();
                        this.context.logger.error("Error loading image " + container.src);
                        return [3 /*break*/, 8];
                    case 8:
                        if (container instanceof canvas_element_container_1.CanvasElementContainer) {
                            this.renderReplacedElement(container, curves, container.canvas);
                        }
                        if (!(container instanceof svg_element_container_1.SVGElementContainer)) return [3 /*break*/, 12];
                        _c.label = 9;
                    case 9:
                        _c.trys.push([9, 11, , 12]);
                        return [4 /*yield*/, this.context.cache.match(container.svg)];
                    case 10:
                        image = _c.sent();
                        this.renderReplacedElement(container, curves, image);
                        return [3 /*break*/, 12];
                    case 11:
                        e_2 = _c.sent();
                        this.context.logger.error("Error loading svg " + container.svg.substring(0, 255));
                        return [3 /*break*/, 12];
                    case 12:
                        if (!(container instanceof iframe_element_container_1.IFrameElementContainer && container.tree)) return [3 /*break*/, 14];
                        iframeRenderer = new CanvasRenderer(this.context, {
                            scale: this.options.scale,
                            backgroundColor: container.backgroundColor,
                            x: 0,
                            y: 0,
                            width: container.width,
                            height: container.height
                        });
                        return [4 /*yield*/, iframeRenderer.render(container.tree)];
                    case 13:
                        canvas = _c.sent();
                        if (container.width && container.height) {
                            this.ctx.drawImage(canvas, 0, 0, container.width, container.height, container.bounds.left, container.bounds.top, container.bounds.width, container.bounds.height);
                        }
                        _c.label = 14;
                    case 14:
                        if (container instanceof input_element_container_1.InputElementContainer) {
                            size = Math.min(container.bounds.width, container.bounds.height);
                            if (container.type === input_element_container_1.CHECKBOX) {
                                if (container.checked) {
                                    this.ctx.save();
                                    this.path([
                                        new vector_1.Vector(container.bounds.left + size * 0.39363, container.bounds.top + size * 0.79),
                                        new vector_1.Vector(container.bounds.left + size * 0.16, container.bounds.top + size * 0.5549),
                                        new vector_1.Vector(container.bounds.left + size * 0.27347, container.bounds.top + size * 0.44071),
                                        new vector_1.Vector(container.bounds.left + size * 0.39694, container.bounds.top + size * 0.5649),
                                        new vector_1.Vector(container.bounds.left + size * 0.72983, container.bounds.top + size * 0.23),
                                        new vector_1.Vector(container.bounds.left + size * 0.84, container.bounds.top + size * 0.34085),
                                        new vector_1.Vector(container.bounds.left + size * 0.39363, container.bounds.top + size * 0.79)
                                    ]);
                                    this.ctx.fillStyle = color_1.asString(input_element_container_1.INPUT_COLOR);
                                    this.ctx.fill();
                                    this.ctx.restore();
                                }
                            }
                            else if (container.type === input_element_container_1.RADIO) {
                                if (container.checked) {
                                    this.ctx.save();
                                    this.ctx.beginPath();
                                    this.ctx.arc(container.bounds.left + size / 2, container.bounds.top + size / 2, size / 4, 0, Math.PI * 2, true);
                                    this.ctx.fillStyle = color_1.asString(input_element_container_1.INPUT_COLOR);
                                    this.ctx.fill();
                                    this.ctx.restore();
                                }
                            }
                        }
                        if (isTextInputElement(container) && container.value.length) {
                            _b = this.createFontStyle(styles), fontFamily = _b[0], fontSize = _b[1];
                            baseline = this.fontMetrics.getMetrics(fontFamily, fontSize).baseline;
                            this.ctx.font = fontFamily;
                            this.ctx.fillStyle = color_1.asString(styles.color);
                            this.ctx.textBaseline = 'alphabetic';
                            this.ctx.textAlign = canvasTextAlign(container.styles.textAlign);
                            bounds = box_sizing_1.contentBox(container);
                            x = 0;
                            switch (container.styles.textAlign) {
                                case 1 /* CENTER */:
                                    x += bounds.width / 2;
                                    break;
                                case 2 /* RIGHT */:
                                    x += bounds.width;
                                    break;
                            }
                            textBounds = bounds.add(x, 0, 0, -bounds.height / 2 + 1);
                            this.ctx.save();
                            this.path([
                                new vector_1.Vector(bounds.left, bounds.top),
                                new vector_1.Vector(bounds.left + bounds.width, bounds.top),
                                new vector_1.Vector(bounds.left + bounds.width, bounds.top + bounds.height),
                                new vector_1.Vector(bounds.left, bounds.top + bounds.height)
                            ]);
                            this.ctx.clip();
                            this.renderTextWithLetterSpacing(new text_1.TextBounds(container.value, textBounds), styles.letterSpacing, baseline);
                            this.ctx.restore();
                            this.ctx.textBaseline = 'alphabetic';
                            this.ctx.textAlign = 'left';
                        }
                        if (!bitwise_1.contains(container.styles.display, 2048 /* LIST_ITEM */)) return [3 /*break*/, 20];
                        if (!(container.styles.listStyleImage !== null)) return [3 /*break*/, 19];
                        img = container.styles.listStyleImage;
                        if (!(img.type === 0 /* URL */)) return [3 /*break*/, 18];
                        image = void 0;
                        url = img.url;
                        _c.label = 15;
                    case 15:
                        _c.trys.push([15, 17, , 18]);
                        return [4 /*yield*/, this.context.cache.match(url)];
                    case 16:
                        image = _c.sent();
                        this.ctx.drawImage(image, container.bounds.left - (image.width + 10), container.bounds.top);
                        return [3 /*break*/, 18];
                    case 17:
                        e_3 = _c.sent();
                        this.context.logger.error("Error loading list-style-image " + url);
                        return [3 /*break*/, 18];
                    case 18: return [3 /*break*/, 20];
                    case 19:
                        if (paint.listValue && container.styles.listStyleType !== -1 /* NONE */) {
                            fontFamily = this.createFontStyle(styles)[0];
                            this.ctx.font = fontFamily;
                            this.ctx.fillStyle = color_1.asString(styles.color);
                            this.ctx.textBaseline = 'middle';
                            this.ctx.textAlign = 'right';
                            bounds = new bounds_1.Bounds(container.bounds.left, container.bounds.top + length_percentage_1.getAbsoluteValue(container.styles.paddingTop, container.bounds.width), container.bounds.width, line_height_1.computeLineHeight(styles.lineHeight, styles.fontSize.number) / 2 + 1);
                            this.renderTextWithLetterSpacing(new text_1.TextBounds(paint.listValue, bounds), styles.letterSpacing, line_height_1.computeLineHeight(styles.lineHeight, styles.fontSize.number) / 2 + 2);
                            this.ctx.textBaseline = 'bottom';
                            this.ctx.textAlign = 'left';
                        }
                        _c.label = 20;
                    case 20: return [2 /*return*/];
                }
            });
        });
    };
    CanvasRenderer.prototype.renderStackContent = function (stack) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, child, _b, _c, child, _d, _e, child, _f, _g, child, _h, _j, child, _k, _l, child, _m, _o, child;
            return __generator(this, function (_p) {
                switch (_p.label) {
                    case 0:
                        if (bitwise_1.contains(stack.element.container.flags, 16 /* DEBUG_RENDER */)) {
                            debugger;
                        }
                        // https://www.w3.org/TR/css-position-3/#painting-order
                        // 1. the background and borders of the element forming the stacking context.
                        return [4 /*yield*/, this.renderNodeBackgroundAndBorders(stack.element)];
                    case 1:
                        // https://www.w3.org/TR/css-position-3/#painting-order
                        // 1. the background and borders of the element forming the stacking context.
                        _p.sent();
                        _i = 0, _a = stack.negativeZIndex;
                        _p.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        child = _a[_i];
                        return [4 /*yield*/, this.renderStack(child)];
                    case 3:
                        _p.sent();
                        _p.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: 
                    // 3. For all its in-flow, non-positioned, block-level descendants in tree order:
                    return [4 /*yield*/, this.renderNodeContent(stack.element)];
                    case 6:
                        // 3. For all its in-flow, non-positioned, block-level descendants in tree order:
                        _p.sent();
                        _b = 0, _c = stack.nonInlineLevel;
                        _p.label = 7;
                    case 7:
                        if (!(_b < _c.length)) return [3 /*break*/, 10];
                        child = _c[_b];
                        return [4 /*yield*/, this.renderNode(child)];
                    case 8:
                        _p.sent();
                        _p.label = 9;
                    case 9:
                        _b++;
                        return [3 /*break*/, 7];
                    case 10:
                        _d = 0, _e = stack.nonPositionedFloats;
                        _p.label = 11;
                    case 11:
                        if (!(_d < _e.length)) return [3 /*break*/, 14];
                        child = _e[_d];
                        return [4 /*yield*/, this.renderStack(child)];
                    case 12:
                        _p.sent();
                        _p.label = 13;
                    case 13:
                        _d++;
                        return [3 /*break*/, 11];
                    case 14:
                        _f = 0, _g = stack.nonPositionedInlineLevel;
                        _p.label = 15;
                    case 15:
                        if (!(_f < _g.length)) return [3 /*break*/, 18];
                        child = _g[_f];
                        return [4 /*yield*/, this.renderStack(child)];
                    case 16:
                        _p.sent();
                        _p.label = 17;
                    case 17:
                        _f++;
                        return [3 /*break*/, 15];
                    case 18:
                        _h = 0, _j = stack.inlineLevel;
                        _p.label = 19;
                    case 19:
                        if (!(_h < _j.length)) return [3 /*break*/, 22];
                        child = _j[_h];
                        return [4 /*yield*/, this.renderNode(child)];
                    case 20:
                        _p.sent();
                        _p.label = 21;
                    case 21:
                        _h++;
                        return [3 /*break*/, 19];
                    case 22:
                        _k = 0, _l = stack.zeroOrAutoZIndexOrTransformedOrOpacity;
                        _p.label = 23;
                    case 23:
                        if (!(_k < _l.length)) return [3 /*break*/, 26];
                        child = _l[_k];
                        return [4 /*yield*/, this.renderStack(child)];
                    case 24:
                        _p.sent();
                        _p.label = 25;
                    case 25:
                        _k++;
                        return [3 /*break*/, 23];
                    case 26:
                        _m = 0, _o = stack.positiveZIndex;
                        _p.label = 27;
                    case 27:
                        if (!(_m < _o.length)) return [3 /*break*/, 30];
                        child = _o[_m];
                        return [4 /*yield*/, this.renderStack(child)];
                    case 28:
                        _p.sent();
                        _p.label = 29;
                    case 29:
                        _m++;
                        return [3 /*break*/, 27];
                    case 30: return [2 /*return*/];
                }
            });
        });
    };
    CanvasRenderer.prototype.mask = function (paths) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.canvas.width, 0);
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.lineTo(0, this.canvas.height);
        this.ctx.lineTo(0, 0);
        this.formatPath(paths.slice(0).reverse());
        this.ctx.closePath();
    };
    CanvasRenderer.prototype.path = function (paths) {
        this.ctx.beginPath();
        this.formatPath(paths);
        this.ctx.closePath();
    };
    CanvasRenderer.prototype.formatPath = function (paths) {
        var _this = this;
        paths.forEach(function (point, index) {
            var start = bezier_curve_1.isBezierCurve(point) ? point.start : point;
            if (index === 0) {
                _this.ctx.moveTo(start.x, start.y);
            }
            else {
                _this.ctx.lineTo(start.x, start.y);
            }
            if (bezier_curve_1.isBezierCurve(point)) {
                _this.ctx.bezierCurveTo(point.startControl.x, point.startControl.y, point.endControl.x, point.endControl.y, point.end.x, point.end.y);
            }
        });
    };
    CanvasRenderer.prototype.renderRepeat = function (path, pattern, offsetX, offsetY) {
        this.path(path);
        this.ctx.fillStyle = pattern;
        this.ctx.translate(offsetX, offsetY);
        this.ctx.fill();
        this.ctx.translate(-offsetX, -offsetY);
    };
    CanvasRenderer.prototype.resizeImage = function (image, width, height) {
        var _a;
        if (image.width === width && image.height === height) {
            return image;
        }
        var ownerDocument = (_a = this.canvas.ownerDocument) !== null && _a !== void 0 ? _a : document;
        var canvas = ownerDocument.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        var ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
        return canvas;
    };
    CanvasRenderer.prototype.renderBackgroundImage = function (container) {
        return __awaiter(this, void 0, void 0, function () {
            var index, _loop_1, this_1, _i, _a, backgroundImage;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        index = container.styles.backgroundImage.length - 1;
                        _loop_1 = function (backgroundImage) {
                            var image, url, e_4, _c, path, x, y, width, height, pattern, _d, path, x, y, width, height, _e, lineLength, x0, x1, y0, y1, canvas, ctx, gradient_2, pattern, _f, path, left, top_1, width, height, position, x, y, _g, rx, ry, radialGradient_1, midX, midY, f, invF;
                            return __generator(this, function (_h) {
                                switch (_h.label) {
                                    case 0:
                                        if (!(backgroundImage.type === 0 /* URL */)) return [3 /*break*/, 5];
                                        image = void 0;
                                        url = backgroundImage.url;
                                        _h.label = 1;
                                    case 1:
                                        _h.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, this_1.context.cache.match(url)];
                                    case 2:
                                        image = _h.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        e_4 = _h.sent();
                                        this_1.context.logger.error("Error loading background-image " + url);
                                        return [3 /*break*/, 4];
                                    case 4:
                                        if (image) {
                                            _c = background_1.calculateBackgroundRendering(container, index, [
                                                image.width,
                                                image.height,
                                                image.width / image.height
                                            ]), path = _c[0], x = _c[1], y = _c[2], width = _c[3], height = _c[4];
                                            pattern = this_1.ctx.createPattern(this_1.resizeImage(image, width, height), 'repeat');
                                            this_1.renderRepeat(path, pattern, x, y);
                                        }
                                        return [3 /*break*/, 6];
                                    case 5:
                                        if (image_1.isLinearGradient(backgroundImage)) {
                                            _d = background_1.calculateBackgroundRendering(container, index, [null, null, null]), path = _d[0], x = _d[1], y = _d[2], width = _d[3], height = _d[4];
                                            _e = gradient_1.calculateGradientDirection(backgroundImage.angle, width, height), lineLength = _e[0], x0 = _e[1], x1 = _e[2], y0 = _e[3], y1 = _e[4];
                                            canvas = document.createElement('canvas');
                                            canvas.width = width;
                                            canvas.height = height;
                                            ctx = canvas.getContext('2d');
                                            gradient_2 = ctx.createLinearGradient(x0, y0, x1, y1);
                                            gradient_1.processColorStops(backgroundImage.stops, lineLength).forEach(function (colorStop) {
                                                return gradient_2.addColorStop(colorStop.stop, color_1.asString(colorStop.color));
                                            });
                                            ctx.fillStyle = gradient_2;
                                            ctx.fillRect(0, 0, width, height);
                                            if (width > 0 && height > 0) {
                                                pattern = this_1.ctx.createPattern(canvas, 'repeat');
                                                this_1.renderRepeat(path, pattern, x, y);
                                            }
                                        }
                                        else if (image_1.isRadialGradient(backgroundImage)) {
                                            _f = background_1.calculateBackgroundRendering(container, index, [
                                                null,
                                                null,
                                                null
                                            ]), path = _f[0], left = _f[1], top_1 = _f[2], width = _f[3], height = _f[4];
                                            position = backgroundImage.position.length === 0 ? [length_percentage_1.FIFTY_PERCENT] : backgroundImage.position;
                                            x = length_percentage_1.getAbsoluteValue(position[0], width);
                                            y = length_percentage_1.getAbsoluteValue(position[position.length - 1], height);
                                            _g = gradient_1.calculateRadius(backgroundImage, x, y, width, height), rx = _g[0], ry = _g[1];
                                            if (rx > 0 && ry > 0) {
                                                radialGradient_1 = this_1.ctx.createRadialGradient(left + x, top_1 + y, 0, left + x, top_1 + y, rx);
                                                gradient_1.processColorStops(backgroundImage.stops, rx * 2).forEach(function (colorStop) {
                                                    return radialGradient_1.addColorStop(colorStop.stop, color_1.asString(colorStop.color));
                                                });
                                                this_1.path(path);
                                                this_1.ctx.fillStyle = radialGradient_1;
                                                if (rx !== ry) {
                                                    midX = container.bounds.left + 0.5 * container.bounds.width;
                                                    midY = container.bounds.top + 0.5 * container.bounds.height;
                                                    f = ry / rx;
                                                    invF = 1 / f;
                                                    this_1.ctx.save();
                                                    this_1.ctx.translate(midX, midY);
                                                    this_1.ctx.transform(1, 0, 0, f, 0, 0);
                                                    this_1.ctx.translate(-midX, -midY);
                                                    this_1.ctx.fillRect(left, invF * (top_1 - midY) + midY, width, height * invF);
                                                    this_1.ctx.restore();
                                                }
                                                else {
                                                    this_1.ctx.fill();
                                                }
                                            }
                                        }
                                        _h.label = 6;
                                    case 6:
                                        index--;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, _a = container.styles.backgroundImage.slice(0).reverse();
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        backgroundImage = _a[_i];
                        return [5 /*yield**/, _loop_1(backgroundImage)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CanvasRenderer.prototype.renderSolidBorder = function (color, side, curvePoints) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.path(border_1.parsePathForBorder(curvePoints, side));
                this.ctx.fillStyle = color_1.asString(color);
                this.ctx.fill();
                return [2 /*return*/];
            });
        });
    };
    CanvasRenderer.prototype.renderDoubleBorder = function (color, width, side, curvePoints) {
        return __awaiter(this, void 0, void 0, function () {
            var outerPaths, innerPaths;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(width < 3)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.renderSolidBorder(color, side, curvePoints)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        outerPaths = border_1.parsePathForBorderDoubleOuter(curvePoints, side);
                        this.path(outerPaths);
                        this.ctx.fillStyle = color_1.asString(color);
                        this.ctx.fill();
                        innerPaths = border_1.parsePathForBorderDoubleInner(curvePoints, side);
                        this.path(innerPaths);
                        this.ctx.fill();
                        return [2 /*return*/];
                }
            });
        });
    };
    CanvasRenderer.prototype.renderNodeBackgroundAndBorders = function (paint) {
        return __awaiter(this, void 0, void 0, function () {
            var styles, hasBackground, borders, backgroundPaintingArea, side, _i, borders_1, border;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.applyEffects(paint.getEffects(2 /* BACKGROUND_BORDERS */));
                        styles = paint.container.styles;
                        hasBackground = !color_1.isTransparent(styles.backgroundColor) || styles.backgroundImage.length;
                        borders = [
                            { style: styles.borderTopStyle, color: styles.borderTopColor, width: styles.borderTopWidth },
                            { style: styles.borderRightStyle, color: styles.borderRightColor, width: styles.borderRightWidth },
                            { style: styles.borderBottomStyle, color: styles.borderBottomColor, width: styles.borderBottomWidth },
                            { style: styles.borderLeftStyle, color: styles.borderLeftColor, width: styles.borderLeftWidth }
                        ];
                        backgroundPaintingArea = calculateBackgroundCurvedPaintingArea(background_1.getBackgroundValueForIndex(styles.backgroundClip, 0), paint.curves);
                        if (!(hasBackground || styles.boxShadow.length)) return [3 /*break*/, 2];
                        this.ctx.save();
                        this.path(backgroundPaintingArea);
                        this.ctx.clip();
                        if (!color_1.isTransparent(styles.backgroundColor)) {
                            this.ctx.fillStyle = color_1.asString(styles.backgroundColor);
                            this.ctx.fill();
                        }
                        return [4 /*yield*/, this.renderBackgroundImage(paint.container)];
                    case 1:
                        _a.sent();
                        this.ctx.restore();
                        styles.boxShadow
                            .slice(0)
                            .reverse()
                            .forEach(function (shadow) {
                            _this.ctx.save();
                            var borderBoxArea = bound_curves_1.calculateBorderBoxPath(paint.curves);
                            var maskOffset = shadow.inset ? 0 : MASK_OFFSET;
                            var shadowPaintingArea = path_1.transformPath(borderBoxArea, -maskOffset + (shadow.inset ? 1 : -1) * shadow.spread.number, (shadow.inset ? 1 : -1) * shadow.spread.number, shadow.spread.number * (shadow.inset ? -2 : 2), shadow.spread.number * (shadow.inset ? -2 : 2));
                            if (shadow.inset) {
                                _this.path(borderBoxArea);
                                _this.ctx.clip();
                                _this.mask(shadowPaintingArea);
                            }
                            else {
                                _this.mask(borderBoxArea);
                                _this.ctx.clip();
                                _this.path(shadowPaintingArea);
                            }
                            _this.ctx.shadowOffsetX = shadow.offsetX.number + maskOffset;
                            _this.ctx.shadowOffsetY = shadow.offsetY.number;
                            _this.ctx.shadowColor = color_1.asString(shadow.color);
                            _this.ctx.shadowBlur = shadow.blur.number;
                            _this.ctx.fillStyle = shadow.inset ? color_1.asString(shadow.color) : 'rgba(0,0,0,1)';
                            _this.ctx.fill();
                            _this.ctx.restore();
                        });
                        _a.label = 2;
                    case 2:
                        side = 0;
                        _i = 0, borders_1 = borders;
                        _a.label = 3;
                    case 3:
                        if (!(_i < borders_1.length)) return [3 /*break*/, 13];
                        border = borders_1[_i];
                        if (!(border.style !== 0 /* NONE */ && !color_1.isTransparent(border.color) && border.width > 0)) return [3 /*break*/, 11];
                        if (!(border.style === 2 /* DASHED */)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.renderDashedDottedBorder(border.color, border.width, side, paint.curves, 2 /* DASHED */)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 5:
                        if (!(border.style === 3 /* DOTTED */)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.renderDashedDottedBorder(border.color, border.width, side, paint.curves, 3 /* DOTTED */)];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 7:
                        if (!(border.style === 4 /* DOUBLE */)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.renderDoubleBorder(border.color, border.width, side, paint.curves)];
                    case 8:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, this.renderSolidBorder(border.color, side, paint.curves)];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11:
                        side++;
                        _a.label = 12;
                    case 12:
                        _i++;
                        return [3 /*break*/, 3];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    CanvasRenderer.prototype.renderDashedDottedBorder = function (color, width, side, curvePoints, style) {
        return __awaiter(this, void 0, void 0, function () {
            var strokePaths, boxPaths, startX, startY, endX, endY, length, dashLength, spaceLength, useLineDash, multiplier, numberOfDashes, minSpace, maxSpace, path1, path2, path1, path2;
            return __generator(this, function (_a) {
                this.ctx.save();
                strokePaths = border_1.parsePathForBorderStroke(curvePoints, side);
                boxPaths = border_1.parsePathForBorder(curvePoints, side);
                if (style === 2 /* DASHED */) {
                    this.path(boxPaths);
                    this.ctx.clip();
                }
                if (bezier_curve_1.isBezierCurve(boxPaths[0])) {
                    startX = boxPaths[0].start.x;
                    startY = boxPaths[0].start.y;
                }
                else {
                    startX = boxPaths[0].x;
                    startY = boxPaths[0].y;
                }
                if (bezier_curve_1.isBezierCurve(boxPaths[1])) {
                    endX = boxPaths[1].end.x;
                    endY = boxPaths[1].end.y;
                }
                else {
                    endX = boxPaths[1].x;
                    endY = boxPaths[1].y;
                }
                if (side === 0 || side === 2) {
                    length = Math.abs(startX - endX);
                }
                else {
                    length = Math.abs(startY - endY);
                }
                this.ctx.beginPath();
                if (style === 3 /* DOTTED */) {
                    this.formatPath(strokePaths);
                }
                else {
                    this.formatPath(boxPaths.slice(0, 2));
                }
                dashLength = width < 3 ? width * 3 : width * 2;
                spaceLength = width < 3 ? width * 2 : width;
                if (style === 3 /* DOTTED */) {
                    dashLength = width;
                    spaceLength = width;
                }
                useLineDash = true;
                if (length <= dashLength * 2) {
                    useLineDash = false;
                }
                else if (length <= dashLength * 2 + spaceLength) {
                    multiplier = length / (2 * dashLength + spaceLength);
                    dashLength *= multiplier;
                    spaceLength *= multiplier;
                }
                else {
                    numberOfDashes = Math.floor((length + spaceLength) / (dashLength + spaceLength));
                    minSpace = (length - numberOfDashes * dashLength) / (numberOfDashes - 1);
                    maxSpace = (length - (numberOfDashes + 1) * dashLength) / numberOfDashes;
                    spaceLength =
                        maxSpace <= 0 || Math.abs(spaceLength - minSpace) < Math.abs(spaceLength - maxSpace)
                            ? minSpace
                            : maxSpace;
                }
                if (useLineDash) {
                    if (style === 3 /* DOTTED */) {
                        this.ctx.setLineDash([0, dashLength + spaceLength]);
                    }
                    else {
                        this.ctx.setLineDash([dashLength, spaceLength]);
                    }
                }
                if (style === 3 /* DOTTED */) {
                    this.ctx.lineCap = 'round';
                    this.ctx.lineWidth = width;
                }
                else {
                    this.ctx.lineWidth = width * 2 + 1.1;
                }
                this.ctx.strokeStyle = color_1.asString(color);
                this.ctx.stroke();
                this.ctx.setLineDash([]);
                // dashed round edge gap
                if (style === 2 /* DASHED */) {
                    if (bezier_curve_1.isBezierCurve(boxPaths[0])) {
                        path1 = boxPaths[3];
                        path2 = boxPaths[0];
                        this.ctx.beginPath();
                        this.formatPath([new vector_1.Vector(path1.end.x, path1.end.y), new vector_1.Vector(path2.start.x, path2.start.y)]);
                        this.ctx.stroke();
                    }
                    if (bezier_curve_1.isBezierCurve(boxPaths[1])) {
                        path1 = boxPaths[1];
                        path2 = boxPaths[2];
                        this.ctx.beginPath();
                        this.formatPath([new vector_1.Vector(path1.end.x, path1.end.y), new vector_1.Vector(path2.start.x, path2.start.y)]);
                        this.ctx.stroke();
                    }
                }
                this.ctx.restore();
                return [2 /*return*/];
            });
        });
    };
    CanvasRenderer.prototype.render = function (element) {
        return __awaiter(this, void 0, void 0, function () {
            var stack;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.options.backgroundColor) {
                            this.ctx.fillStyle = color_1.asString(this.options.backgroundColor);
                            this.ctx.fillRect(this.options.x, this.options.y, this.options.width, this.options.height);
                        }
                        stack = stacking_context_1.parseStackingContexts(element);
                        return [4 /*yield*/, this.renderStack(stack)];
                    case 1:
                        _a.sent();
                        this.applyEffects([]);
                        return [2 /*return*/, this.canvas];
                }
            });
        });
    };
    return CanvasRenderer;
}(renderer_1.Renderer));
exports.CanvasRenderer = CanvasRenderer;
var isTextInputElement = function (container) {
    if (container instanceof textarea_element_container_1.TextareaElementContainer) {
        return true;
    }
    else if (container instanceof select_element_container_1.SelectElementContainer) {
        return true;
    }
    else if (container instanceof input_element_container_1.InputElementContainer && container.type !== input_element_container_1.RADIO && container.type !== input_element_container_1.CHECKBOX) {
        return true;
    }
    return false;
};
var calculateBackgroundCurvedPaintingArea = function (clip, curves) {
    switch (clip) {
        case 0 /* BORDER_BOX */:
            return bound_curves_1.calculateBorderBoxPath(curves);
        case 2 /* CONTENT_BOX */:
            return bound_curves_1.calculateContentBoxPath(curves);
        case 1 /* PADDING_BOX */:
        default:
            return bound_curves_1.calculatePaddingBoxPath(curves);
    }
};
var canvasTextAlign = function (textAlign) {
    switch (textAlign) {
        case 1 /* CENTER */:
            return 'center';
        case 2 /* RIGHT */:
            return 'right';
        case 0 /* LEFT */:
        default:
            return 'left';
    }
};
// see https://github.com/niklasvh/html2canvas/pull/2645
var iOSBrokenFonts = ['-apple-system', 'system-ui'];
var fixIOSSystemFonts = function (fontFamilies) {
    return /iPhone OS 15_(0|1)/.test(window.navigator.userAgent)
        ? fontFamilies.filter(function (fontFamily) { return iOSBrokenFonts.indexOf(fontFamily) === -1; })
        : fontFamilies;
};
//# sourceMappingURL=canvas-renderer.js.map