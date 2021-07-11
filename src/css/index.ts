import {CSSPropertyDescriptor, PropertyDescriptorParsingType} from './IPropertyDescriptor';
import {backgroundClip} from './property-descriptors/background-clip';
import {backgroundColor} from './property-descriptors/background-color';
import {backgroundImage} from './property-descriptors/background-image';
import {backgroundOrigin} from './property-descriptors/background-origin';
import {backgroundPosition} from './property-descriptors/background-position';
import {backgroundRepeat} from './property-descriptors/background-repeat';
import {backgroundSize} from './property-descriptors/background-size';
import {
    borderBottomColor,
    borderLeftColor,
    borderRightColor,
    borderTopColor
} from './property-descriptors/border-color';
import {
    borderBottomLeftRadius,
    borderBottomRightRadius,
    borderTopLeftRadius,
    borderTopRightRadius
} from './property-descriptors/border-radius';
import {
    borderBottomStyle,
    borderLeftStyle,
    borderRightStyle,
    borderTopStyle
} from './property-descriptors/border-style';
import {
    borderBottomWidth,
    borderLeftWidth,
    borderRightWidth,
    borderTopWidth
} from './property-descriptors/border-width';
import {color} from './property-descriptors/color';
import {display, DISPLAY} from './property-descriptors/display';
import {float, FLOAT} from './property-descriptors/float';
import {letterSpacing} from './property-descriptors/letter-spacing';
import {lineBreak} from './property-descriptors/line-break';
import {lineHeight} from './property-descriptors/line-height';
import {listStyleImage} from './property-descriptors/list-style-image';
import {listStylePosition} from './property-descriptors/list-style-position';
import {listStyleType} from './property-descriptors/list-style-type';
import {marginBottom, marginLeft, marginRight, marginTop} from './property-descriptors/margin';
import {overflow, OVERFLOW} from './property-descriptors/overflow';
import {overflowWrap} from './property-descriptors/overflow-wrap';
import {paddingBottom, paddingLeft, paddingRight, paddingTop} from './property-descriptors/padding';
import {textAlign} from './property-descriptors/text-align';
import {position, POSITION} from './property-descriptors/position';
import {textShadow} from './property-descriptors/text-shadow';
import {textTransform} from './property-descriptors/text-transform';
import {transform} from './property-descriptors/transform';
import {transformOrigin} from './property-descriptors/transform-origin';
import {visibility, VISIBILITY} from './property-descriptors/visibility';
import {wordBreak} from './property-descriptors/word-break';
import {zIndex} from './property-descriptors/z-index';
import {CSSValue, isIdentToken, Parser} from './syntax/parser';
import {Tokenizer} from './syntax/tokenizer';
import {Color, color as colorType, isTransparent} from './types/color';
import {angle} from './types/angle';
import {image} from './types/image';
import {opacity} from './property-descriptors/opacity';
import {textDecorationColor} from './property-descriptors/text-decoration-color';
import {textDecorationLine} from './property-descriptors/text-decoration-line';
import {isLengthPercentage, LengthPercentage, ZERO_LENGTH} from './types/length-percentage';
import {fontFamily} from './property-descriptors/font-family';
import {fontSize} from './property-descriptors/font-size';
import {isLength} from './types/length';
import {fontWeight} from './property-descriptors/font-weight';
import {fontVariant} from './property-descriptors/font-variant';
import {fontStyle} from './property-descriptors/font-style';
import {contains} from '../core/bitwise';
import {content} from './property-descriptors/content';
import {counterIncrement} from './property-descriptors/counter-increment';
import {counterReset} from './property-descriptors/counter-reset';
import {quotes} from './property-descriptors/quotes';
import {boxShadow} from './property-descriptors/box-shadow';

export class CSSParsedDeclaration {
    backgroundClip: ReturnType<typeof backgroundClip.parse>;
    backgroundColor: Color;
    backgroundImage: ReturnType<typeof backgroundImage.parse>;
    backgroundOrigin: ReturnType<typeof backgroundOrigin.parse>;
    backgroundPosition: ReturnType<typeof backgroundPosition.parse>;
    backgroundRepeat: ReturnType<typeof backgroundRepeat.parse>;
    backgroundSize: ReturnType<typeof backgroundSize.parse>;
    borderTopColor: Color;
    borderRightColor: Color;
    borderBottomColor: Color;
    borderLeftColor: Color;
    borderTopLeftRadius: ReturnType<typeof borderTopLeftRadius.parse>;
    borderTopRightRadius: ReturnType<typeof borderTopRightRadius.parse>;
    borderBottomRightRadius: ReturnType<typeof borderBottomRightRadius.parse>;
    borderBottomLeftRadius: ReturnType<typeof borderBottomLeftRadius.parse>;
    borderTopStyle: ReturnType<typeof borderTopStyle.parse>;
    borderRightStyle: ReturnType<typeof borderRightStyle.parse>;
    borderBottomStyle: ReturnType<typeof borderBottomStyle.parse>;
    borderLeftStyle: ReturnType<typeof borderLeftStyle.parse>;
    borderTopWidth: ReturnType<typeof borderTopWidth.parse>;
    borderRightWidth: ReturnType<typeof borderRightWidth.parse>;
    borderBottomWidth: ReturnType<typeof borderBottomWidth.parse>;
    borderLeftWidth: ReturnType<typeof borderLeftWidth.parse>;
    boxShadow: ReturnType<typeof boxShadow.parse>;
    color: Color;
    display: ReturnType<typeof display.parse>;
    float: ReturnType<typeof float.parse>;
    fontFamily: ReturnType<typeof fontFamily.parse>;
    fontSize: LengthPercentage;
    fontStyle: ReturnType<typeof fontStyle.parse>;
    fontVariant: ReturnType<typeof fontVariant.parse>;
    fontWeight: ReturnType<typeof fontWeight.parse>;
    letterSpacing: ReturnType<typeof letterSpacing.parse>;
    lineBreak: ReturnType<typeof lineBreak.parse>;
    lineHeight: CSSValue;
    listStyleImage: ReturnType<typeof listStyleImage.parse>;
    listStylePosition: ReturnType<typeof listStylePosition.parse>;
    listStyleType: ReturnType<typeof listStyleType.parse>;
    marginTop: CSSValue;
    marginRight: CSSValue;
    marginBottom: CSSValue;
    marginLeft: CSSValue;
    opacity: ReturnType<typeof opacity.parse>;
    overflowX: OVERFLOW;
    overflowY: OVERFLOW;
    overflowWrap: ReturnType<typeof overflowWrap.parse>;
    paddingTop: LengthPercentage;
    paddingRight: LengthPercentage;
    paddingBottom: LengthPercentage;
    paddingLeft: LengthPercentage;
    position: ReturnType<typeof position.parse>;
    textAlign: ReturnType<typeof textAlign.parse>;
    textDecorationColor: Color;
    textDecorationLine: ReturnType<typeof textDecorationLine.parse>;
    textShadow: ReturnType<typeof textShadow.parse>;
    textTransform: ReturnType<typeof textTransform.parse>;
    transform: ReturnType<typeof transform.parse>;
    transformOrigin: ReturnType<typeof transformOrigin.parse>;
    visibility: ReturnType<typeof visibility.parse>;
    wordBreak: ReturnType<typeof wordBreak.parse>;
    zIndex: ReturnType<typeof zIndex.parse>;

    constructor(declaration: CSSStyleDeclaration) {
        this.backgroundClip = parse(backgroundClip, declaration.backgroundClip);
        this.backgroundColor = parse(backgroundColor, declaration.backgroundColor);
        this.backgroundImage = parse(backgroundImage, declaration.backgroundImage);
        this.backgroundOrigin = parse(backgroundOrigin, declaration.backgroundOrigin);
        this.backgroundPosition = parse(backgroundPosition, declaration.backgroundPosition);
        this.backgroundRepeat = parse(backgroundRepeat, declaration.backgroundRepeat);
        this.backgroundSize = parse(backgroundSize, declaration.backgroundSize);
        this.borderTopColor = parse(borderTopColor, declaration.borderTopColor);
        this.borderRightColor = parse(borderRightColor, declaration.borderRightColor);
        this.borderBottomColor = parse(borderBottomColor, declaration.borderBottomColor);
        this.borderLeftColor = parse(borderLeftColor, declaration.borderLeftColor);
        this.borderTopLeftRadius = parse(borderTopLeftRadius, declaration.borderTopLeftRadius);
        this.borderTopRightRadius = parse(borderTopRightRadius, declaration.borderTopRightRadius);
        this.borderBottomRightRadius = parse(borderBottomRightRadius, declaration.borderBottomRightRadius);
        this.borderBottomLeftRadius = parse(borderBottomLeftRadius, declaration.borderBottomLeftRadius);
        this.borderTopStyle = parse(borderTopStyle, declaration.borderTopStyle);
        this.borderRightStyle = parse(borderRightStyle, declaration.borderRightStyle);
        this.borderBottomStyle = parse(borderBottomStyle, declaration.borderBottomStyle);
        this.borderLeftStyle = parse(borderLeftStyle, declaration.borderLeftStyle);
        this.borderTopWidth = parse(borderTopWidth, declaration.borderTopWidth);
        this.borderRightWidth = parse(borderRightWidth, declaration.borderRightWidth);
        this.borderBottomWidth = parse(borderBottomWidth, declaration.borderBottomWidth);
        this.borderLeftWidth = parse(borderLeftWidth, declaration.borderLeftWidth);
        this.boxShadow = parse(boxShadow, declaration.boxShadow);
        this.color = parse(color, declaration.color);
        this.display = parse(display, declaration.display);
        this.float = parse(float, declaration.cssFloat);
        this.fontFamily = parse(fontFamily, declaration.fontFamily);
        this.fontSize = parse(fontSize, declaration.fontSize);
        this.fontStyle = parse(fontStyle, declaration.fontStyle);
        this.fontVariant = parse(fontVariant, declaration.fontVariant);
        this.fontWeight = parse(fontWeight, declaration.fontWeight);
        this.letterSpacing = parse(letterSpacing, declaration.letterSpacing);
        this.lineBreak = parse(lineBreak, declaration.lineBreak);
        this.lineHeight = parse(lineHeight, declaration.lineHeight);
        this.listStyleImage = parse(listStyleImage, declaration.listStyleImage);
        this.listStylePosition = parse(listStylePosition, declaration.listStylePosition);
        this.listStyleType = parse(listStyleType, declaration.listStyleType);
        this.marginTop = parse(marginTop, declaration.marginTop);
        this.marginRight = parse(marginRight, declaration.marginRight);
        this.marginBottom = parse(marginBottom, declaration.marginBottom);
        this.marginLeft = parse(marginLeft, declaration.marginLeft);
        this.opacity = parse(opacity, declaration.opacity);
        const overflowTuple = parse(overflow, declaration.overflow);
        this.overflowX = overflowTuple[0];
        this.overflowY = overflowTuple[overflowTuple.length > 1 ? 1 : 0];
        this.overflowWrap = parse(overflowWrap, declaration.overflowWrap);
        this.paddingTop = parse(paddingTop, declaration.paddingTop);
        this.paddingRight = parse(paddingRight, declaration.paddingRight);
        this.paddingBottom = parse(paddingBottom, declaration.paddingBottom);
        this.paddingLeft = parse(paddingLeft, declaration.paddingLeft);
        this.position = parse(position, declaration.position);
        this.textAlign = parse(textAlign, declaration.textAlign);
        this.textDecorationColor = parse(textDecorationColor, declaration.textDecorationColor ?? declaration.color);
        this.textDecorationLine = parse(
            textDecorationLine,
            declaration.textDecorationLine ?? declaration.textDecoration
        );
        this.textShadow = parse(textShadow, declaration.textShadow);
        this.textTransform = parse(textTransform, declaration.textTransform);
        this.transform = parse(transform, declaration.transform);
        this.transformOrigin = parse(transformOrigin, declaration.transformOrigin);
        this.visibility = parse(visibility, declaration.visibility);
        this.wordBreak = parse(wordBreak, declaration.wordBreak);
        this.zIndex = parse(zIndex, declaration.zIndex);
    }

    isVisible(): boolean {
        return this.display > 0 && this.opacity > 0 && this.visibility === VISIBILITY.VISIBLE;
    }

    isTransparent(): boolean {
        return isTransparent(this.backgroundColor);
    }

    isTransformed(): boolean {
        return this.transform !== null;
    }

    isPositioned(): boolean {
        return this.position !== POSITION.STATIC;
    }

    isPositionedWithZIndex(): boolean {
        return this.isPositioned() && !this.zIndex.auto;
    }

    isFloating(): boolean {
        return this.float !== FLOAT.NONE;
    }

    isInlineLevel(): boolean {
        return (
            contains(this.display, DISPLAY.INLINE) ||
            contains(this.display, DISPLAY.INLINE_BLOCK) ||
            contains(this.display, DISPLAY.INLINE_FLEX) ||
            contains(this.display, DISPLAY.INLINE_GRID) ||
            contains(this.display, DISPLAY.INLINE_LIST_ITEM) ||
            contains(this.display, DISPLAY.INLINE_TABLE)
        );
    }
}

export class CSSParsedPseudoDeclaration {
    content: ReturnType<typeof content.parse>;
    quotes: ReturnType<typeof quotes.parse>;

    constructor(declaration: CSSStyleDeclaration) {
        this.content = parse(content, declaration.content);
        this.quotes = parse(quotes, declaration.quotes);
    }
}

export class CSSParsedCounterDeclaration {
    counterIncrement: ReturnType<typeof counterIncrement.parse>;
    counterReset: ReturnType<typeof counterReset.parse>;

    constructor(declaration: CSSStyleDeclaration) {
        this.counterIncrement = parse(counterIncrement, declaration.counterIncrement);
        this.counterReset = parse(counterReset, declaration.counterReset);
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parse = (descriptor: CSSPropertyDescriptor<any>, style?: string | null) => {
    const tokenizer = new Tokenizer();
    const value = style !== null && typeof style !== 'undefined' ? style.toString() : descriptor.initialValue;
    tokenizer.write(value);
    const parser = new Parser(tokenizer.read());
    switch (descriptor.type) {
        case PropertyDescriptorParsingType.IDENT_VALUE:
            const token = parser.parseComponentValue();
            return descriptor.parse(isIdentToken(token) ? token.value : descriptor.initialValue);
        case PropertyDescriptorParsingType.VALUE:
            return descriptor.parse(parser.parseComponentValue());
        case PropertyDescriptorParsingType.LIST:
            return descriptor.parse(parser.parseComponentValues());
        case PropertyDescriptorParsingType.TOKEN_VALUE:
            return parser.parseComponentValue();
        case PropertyDescriptorParsingType.TYPE_VALUE:
            switch (descriptor.format) {
                case 'angle':
                    return angle.parse(parser.parseComponentValue());
                case 'color':
                    return colorType.parse(parser.parseComponentValue());
                case 'image':
                    return image.parse(parser.parseComponentValue());
                case 'length':
                    const length = parser.parseComponentValue();
                    return isLength(length) ? length : ZERO_LENGTH;
                case 'length-percentage':
                    const value = parser.parseComponentValue();
                    return isLengthPercentage(value) ? value : ZERO_LENGTH;
            }
            break;
    }
};
