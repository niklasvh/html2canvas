"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSSParsedCounterDeclaration = exports.CSSParsedPseudoDeclaration = exports.CSSParsedDeclaration = void 0;
var background_clip_1 = require("./property-descriptors/background-clip");
var background_color_1 = require("./property-descriptors/background-color");
var background_image_1 = require("./property-descriptors/background-image");
var background_origin_1 = require("./property-descriptors/background-origin");
var background_position_1 = require("./property-descriptors/background-position");
var background_repeat_1 = require("./property-descriptors/background-repeat");
var background_size_1 = require("./property-descriptors/background-size");
var border_color_1 = require("./property-descriptors/border-color");
var border_radius_1 = require("./property-descriptors/border-radius");
var border_style_1 = require("./property-descriptors/border-style");
var border_width_1 = require("./property-descriptors/border-width");
var color_1 = require("./property-descriptors/color");
var direction_1 = require("./property-descriptors/direction");
var display_1 = require("./property-descriptors/display");
var float_1 = require("./property-descriptors/float");
var letter_spacing_1 = require("./property-descriptors/letter-spacing");
var line_break_1 = require("./property-descriptors/line-break");
var line_height_1 = require("./property-descriptors/line-height");
var list_style_image_1 = require("./property-descriptors/list-style-image");
var list_style_position_1 = require("./property-descriptors/list-style-position");
var list_style_type_1 = require("./property-descriptors/list-style-type");
var margin_1 = require("./property-descriptors/margin");
var overflow_1 = require("./property-descriptors/overflow");
var overflow_wrap_1 = require("./property-descriptors/overflow-wrap");
var padding_1 = require("./property-descriptors/padding");
var text_align_1 = require("./property-descriptors/text-align");
var position_1 = require("./property-descriptors/position");
var text_shadow_1 = require("./property-descriptors/text-shadow");
var text_transform_1 = require("./property-descriptors/text-transform");
var transform_1 = require("./property-descriptors/transform");
var transform_origin_1 = require("./property-descriptors/transform-origin");
var visibility_1 = require("./property-descriptors/visibility");
var word_break_1 = require("./property-descriptors/word-break");
var z_index_1 = require("./property-descriptors/z-index");
var parser_1 = require("./syntax/parser");
var tokenizer_1 = require("./syntax/tokenizer");
var color_2 = require("./types/color");
var angle_1 = require("./types/angle");
var image_1 = require("./types/image");
var time_1 = require("./types/time");
var opacity_1 = require("./property-descriptors/opacity");
var text_decoration_color_1 = require("./property-descriptors/text-decoration-color");
var text_decoration_line_1 = require("./property-descriptors/text-decoration-line");
var length_percentage_1 = require("./types/length-percentage");
var font_family_1 = require("./property-descriptors/font-family");
var font_size_1 = require("./property-descriptors/font-size");
var length_1 = require("./types/length");
var font_weight_1 = require("./property-descriptors/font-weight");
var font_variant_1 = require("./property-descriptors/font-variant");
var font_style_1 = require("./property-descriptors/font-style");
var bitwise_1 = require("../core/bitwise");
var content_1 = require("./property-descriptors/content");
var counter_increment_1 = require("./property-descriptors/counter-increment");
var counter_reset_1 = require("./property-descriptors/counter-reset");
var duration_1 = require("./property-descriptors/duration");
var quotes_1 = require("./property-descriptors/quotes");
var box_shadow_1 = require("./property-descriptors/box-shadow");
var paint_order_1 = require("./property-descriptors/paint-order");
var webkit_text_stroke_color_1 = require("./property-descriptors/webkit-text-stroke-color");
var webkit_text_stroke_width_1 = require("./property-descriptors/webkit-text-stroke-width");
var CSSParsedDeclaration = /** @class */ (function () {
    function CSSParsedDeclaration(context, declaration) {
        var _a, _b;
        this.animationDuration = parse(context, duration_1.duration, declaration.animationDuration);
        this.backgroundClip = parse(context, background_clip_1.backgroundClip, declaration.backgroundClip);
        this.backgroundColor = parse(context, background_color_1.backgroundColor, declaration.backgroundColor);
        this.backgroundImage = parse(context, background_image_1.backgroundImage, declaration.backgroundImage);
        this.backgroundOrigin = parse(context, background_origin_1.backgroundOrigin, declaration.backgroundOrigin);
        this.backgroundPosition = parse(context, background_position_1.backgroundPosition, declaration.backgroundPosition);
        this.backgroundRepeat = parse(context, background_repeat_1.backgroundRepeat, declaration.backgroundRepeat);
        this.backgroundSize = parse(context, background_size_1.backgroundSize, declaration.backgroundSize);
        this.borderTopColor = parse(context, border_color_1.borderTopColor, declaration.borderTopColor);
        this.borderRightColor = parse(context, border_color_1.borderRightColor, declaration.borderRightColor);
        this.borderBottomColor = parse(context, border_color_1.borderBottomColor, declaration.borderBottomColor);
        this.borderLeftColor = parse(context, border_color_1.borderLeftColor, declaration.borderLeftColor);
        this.borderTopLeftRadius = parse(context, border_radius_1.borderTopLeftRadius, declaration.borderTopLeftRadius);
        this.borderTopRightRadius = parse(context, border_radius_1.borderTopRightRadius, declaration.borderTopRightRadius);
        this.borderBottomRightRadius = parse(context, border_radius_1.borderBottomRightRadius, declaration.borderBottomRightRadius);
        this.borderBottomLeftRadius = parse(context, border_radius_1.borderBottomLeftRadius, declaration.borderBottomLeftRadius);
        this.borderTopStyle = parse(context, border_style_1.borderTopStyle, declaration.borderTopStyle);
        this.borderRightStyle = parse(context, border_style_1.borderRightStyle, declaration.borderRightStyle);
        this.borderBottomStyle = parse(context, border_style_1.borderBottomStyle, declaration.borderBottomStyle);
        this.borderLeftStyle = parse(context, border_style_1.borderLeftStyle, declaration.borderLeftStyle);
        this.borderTopWidth = parse(context, border_width_1.borderTopWidth, declaration.borderTopWidth);
        this.borderRightWidth = parse(context, border_width_1.borderRightWidth, declaration.borderRightWidth);
        this.borderBottomWidth = parse(context, border_width_1.borderBottomWidth, declaration.borderBottomWidth);
        this.borderLeftWidth = parse(context, border_width_1.borderLeftWidth, declaration.borderLeftWidth);
        this.boxShadow = parse(context, box_shadow_1.boxShadow, declaration.boxShadow);
        this.color = parse(context, color_1.color, declaration.color);
        this.direction = parse(context, direction_1.direction, declaration.direction);
        this.display = parse(context, display_1.display, declaration.display);
        this.float = parse(context, float_1.float, declaration.cssFloat);
        this.fontFamily = parse(context, font_family_1.fontFamily, declaration.fontFamily);
        this.fontSize = parse(context, font_size_1.fontSize, declaration.fontSize);
        this.fontStyle = parse(context, font_style_1.fontStyle, declaration.fontStyle);
        this.fontVariant = parse(context, font_variant_1.fontVariant, declaration.fontVariant);
        this.fontWeight = parse(context, font_weight_1.fontWeight, declaration.fontWeight);
        this.letterSpacing = parse(context, letter_spacing_1.letterSpacing, declaration.letterSpacing);
        this.lineBreak = parse(context, line_break_1.lineBreak, declaration.lineBreak);
        this.lineHeight = parse(context, line_height_1.lineHeight, declaration.lineHeight);
        this.listStyleImage = parse(context, list_style_image_1.listStyleImage, declaration.listStyleImage);
        this.listStylePosition = parse(context, list_style_position_1.listStylePosition, declaration.listStylePosition);
        this.listStyleType = parse(context, list_style_type_1.listStyleType, declaration.listStyleType);
        this.marginTop = parse(context, margin_1.marginTop, declaration.marginTop);
        this.marginRight = parse(context, margin_1.marginRight, declaration.marginRight);
        this.marginBottom = parse(context, margin_1.marginBottom, declaration.marginBottom);
        this.marginLeft = parse(context, margin_1.marginLeft, declaration.marginLeft);
        this.opacity = parse(context, opacity_1.opacity, declaration.opacity);
        var overflowTuple = parse(context, overflow_1.overflow, declaration.overflow);
        this.overflowX = overflowTuple[0];
        this.overflowY = overflowTuple[overflowTuple.length > 1 ? 1 : 0];
        this.overflowWrap = parse(context, overflow_wrap_1.overflowWrap, declaration.overflowWrap);
        this.paddingTop = parse(context, padding_1.paddingTop, declaration.paddingTop);
        this.paddingRight = parse(context, padding_1.paddingRight, declaration.paddingRight);
        this.paddingBottom = parse(context, padding_1.paddingBottom, declaration.paddingBottom);
        this.paddingLeft = parse(context, padding_1.paddingLeft, declaration.paddingLeft);
        this.paintOrder = parse(context, paint_order_1.paintOrder, declaration.paintOrder);
        this.position = parse(context, position_1.position, declaration.position);
        this.textAlign = parse(context, text_align_1.textAlign, declaration.textAlign);
        this.textDecorationColor = parse(context, text_decoration_color_1.textDecorationColor, (_a = declaration.textDecorationColor) !== null && _a !== void 0 ? _a : declaration.color);
        this.textDecorationLine = parse(context, text_decoration_line_1.textDecorationLine, (_b = declaration.textDecorationLine) !== null && _b !== void 0 ? _b : declaration.textDecoration);
        this.textShadow = parse(context, text_shadow_1.textShadow, declaration.textShadow);
        this.textTransform = parse(context, text_transform_1.textTransform, declaration.textTransform);
        this.transform = parse(context, transform_1.transform, declaration.transform);
        this.transformOrigin = parse(context, transform_origin_1.transformOrigin, declaration.transformOrigin);
        this.visibility = parse(context, visibility_1.visibility, declaration.visibility);
        this.webkitTextStrokeColor = parse(context, webkit_text_stroke_color_1.webkitTextStrokeColor, declaration.webkitTextStrokeColor);
        this.webkitTextStrokeWidth = parse(context, webkit_text_stroke_width_1.webkitTextStrokeWidth, declaration.webkitTextStrokeWidth);
        this.wordBreak = parse(context, word_break_1.wordBreak, declaration.wordBreak);
        this.zIndex = parse(context, z_index_1.zIndex, declaration.zIndex);
    }
    CSSParsedDeclaration.prototype.isVisible = function () {
        return this.display > 0 && this.opacity > 0 && this.visibility === 0 /* VISIBLE */;
    };
    CSSParsedDeclaration.prototype.isTransparent = function () {
        return color_2.isTransparent(this.backgroundColor);
    };
    CSSParsedDeclaration.prototype.isTransformed = function () {
        return this.transform !== null;
    };
    CSSParsedDeclaration.prototype.isPositioned = function () {
        return this.position !== 0 /* STATIC */;
    };
    CSSParsedDeclaration.prototype.isPositionedWithZIndex = function () {
        return this.isPositioned() && !this.zIndex.auto;
    };
    CSSParsedDeclaration.prototype.isFloating = function () {
        return this.float !== 0 /* NONE */;
    };
    CSSParsedDeclaration.prototype.isInlineLevel = function () {
        return (bitwise_1.contains(this.display, 4 /* INLINE */) ||
            bitwise_1.contains(this.display, 33554432 /* INLINE_BLOCK */) ||
            bitwise_1.contains(this.display, 268435456 /* INLINE_FLEX */) ||
            bitwise_1.contains(this.display, 536870912 /* INLINE_GRID */) ||
            bitwise_1.contains(this.display, 67108864 /* INLINE_LIST_ITEM */) ||
            bitwise_1.contains(this.display, 134217728 /* INLINE_TABLE */));
    };
    return CSSParsedDeclaration;
}());
exports.CSSParsedDeclaration = CSSParsedDeclaration;
var CSSParsedPseudoDeclaration = /** @class */ (function () {
    function CSSParsedPseudoDeclaration(context, declaration) {
        this.content = parse(context, content_1.content, declaration.content);
        this.quotes = parse(context, quotes_1.quotes, declaration.quotes);
    }
    return CSSParsedPseudoDeclaration;
}());
exports.CSSParsedPseudoDeclaration = CSSParsedPseudoDeclaration;
var CSSParsedCounterDeclaration = /** @class */ (function () {
    function CSSParsedCounterDeclaration(context, declaration) {
        this.counterIncrement = parse(context, counter_increment_1.counterIncrement, declaration.counterIncrement);
        this.counterReset = parse(context, counter_reset_1.counterReset, declaration.counterReset);
    }
    return CSSParsedCounterDeclaration;
}());
exports.CSSParsedCounterDeclaration = CSSParsedCounterDeclaration;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var parse = function (context, descriptor, style) {
    var tokenizer = new tokenizer_1.Tokenizer();
    var value = style !== null && typeof style !== 'undefined' ? style.toString() : descriptor.initialValue;
    tokenizer.write(value);
    var parser = new parser_1.Parser(tokenizer.read());
    switch (descriptor.type) {
        case 2 /* IDENT_VALUE */:
            var token = parser.parseComponentValue();
            return descriptor.parse(context, parser_1.isIdentToken(token) ? token.value : descriptor.initialValue);
        case 0 /* VALUE */:
            return descriptor.parse(context, parser.parseComponentValue());
        case 1 /* LIST */:
            return descriptor.parse(context, parser.parseComponentValues());
        case 4 /* TOKEN_VALUE */:
            return parser.parseComponentValue();
        case 3 /* TYPE_VALUE */:
            switch (descriptor.format) {
                case 'angle':
                    return angle_1.angle.parse(context, parser.parseComponentValue());
                case 'color':
                    return color_2.color.parse(context, parser.parseComponentValue());
                case 'image':
                    return image_1.image.parse(context, parser.parseComponentValue());
                case 'length':
                    var length_2 = parser.parseComponentValue();
                    return length_1.isLength(length_2) ? length_2 : length_percentage_1.ZERO_LENGTH;
                case 'length-percentage':
                    var value_1 = parser.parseComponentValue();
                    return length_percentage_1.isLengthPercentage(value_1) ? value_1 : length_percentage_1.ZERO_LENGTH;
                case 'time':
                    return time_1.time.parse(context, parser.parseComponentValue());
            }
            break;
    }
};
//# sourceMappingURL=index.js.map