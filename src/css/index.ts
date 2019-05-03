import {
    CSSPropertyDescriptor,
    PropertyDescriptorParsingType
} from "./IPropertyDescriptor";
import {backgroundClip} from "./property-descriptors/background-clip";
import {backgroundColor} from "./property-descriptors/background-color";
import {backgroundImage} from "./property-descriptors/background-image";
import {backgroundOrigin} from "./property-descriptors/background-origin";
import {backgroundPosition} from "./property-descriptors/background-position";
import {backgroundRepeat} from "./property-descriptors/background-repeat";
import {backgroundSize} from "./property-descriptors/background-size";
import {
    borderBottomColor, borderLeftColor, borderRightColor,
    borderTopColor
} from "./property-descriptors/border-color";
import {
    borderBottomLeftRadius, borderBottomRightRadius, borderTopLeftRadius, borderTopRightRadius
} from "./property-descriptors/border-radius";
import {
    borderBottomStyle, borderLeftStyle, borderRightStyle,
    borderTopStyle
} from "./property-descriptors/border-style";
import {
    borderBottomWidth, borderLeftWidth, borderRightWidth,
    borderTopWidth
} from "./property-descriptors/border-width";
import {color} from "./property-descriptors/color";
import {display, DISPLAY} from "./property-descriptors/display";
import {float, FLOAT} from "./property-descriptors/float";
import {letterSpacing} from "./property-descriptors/letter-spacing";
import {lineBreak} from "./property-descriptors/line-break";
import {listStylePosition} from "./property-descriptors/list-style-position";
import {listStyleType} from "./property-descriptors/list-style-type";
import {marginBottom, marginLeft, marginRight, marginTop} from "./property-descriptors/margin";
import {overflow} from "./property-descriptors/overflow";
import {overflowWrap} from "./property-descriptors/overflow-wrap";
import {paddingBottom, paddingLeft, paddingRight, paddingTop} from "./property-descriptors/padding";
import {position, POSITION} from "./property-descriptors/position";
import {textTransform} from "./property-descriptors/text-transform";
import {transform} from "./property-descriptors/transform";
import {transformOrigin} from "./property-descriptors/transform-origin";
import {visibility, VISIBILITY} from "./property-descriptors/visibility";
import {wordBreak} from "./property-descriptors/word-break";
import {zIndex} from "./property-descriptors/z-index";
import {CSSValue, isIdentToken, Parser} from "./syntax/parser";
import {Tokenizer} from "./syntax/tokenizer";
import {Color, color as colorType, isTransparent} from "./types/color";
import {angle} from "./types/angle";
import {image} from "./types/image";
import {opacity} from "./property-descriptors/opacity";
import {textDecorationColor} from "./property-descriptors/text-decoration-color";
import {textDecorationLine} from "./property-descriptors/text-decoration-line";
import {isLengthPercentage, LengthPercentage, ZERO_LENGTH} from "./types/length-percentage";
import {fontFamily} from "./property-descriptors/font-family";
import {fontSize} from "./property-descriptors/font-size";
import {isLength} from "./types/length";
import {fontWeight} from "./property-descriptors/font-weight";
import {fontVariant} from "./property-descriptors/font-variant";
import {fontStyle} from "./property-descriptors/font-style";
import {contains} from "../core/bitwise";

// export type CSSRegisteredProperty = keyof typeof CSS.registeredPropertySet;

type KnownKeys<T> = {
    [K in keyof T]: string extends K ? never : number extends K ? never : K
} extends {[_ in keyof T]: infer U} ? ({} extends U ? never : U) : never;

type GetInnerType<S> = S extends CSSPropertyDescriptor<infer T> ? T : never

export type CSSRegisteredProperty = KnownKeys<typeof CSS.registeredPropertySet>;
export type CSSRegisteredDeclarations = {[K in CSSRegisteredProperty]: GetInnerType<typeof CSS.registeredPropertySet[K]>};

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
    listStylePosition: ReturnType<typeof listStylePosition.parse>;
    listStyleType: ReturnType<typeof listStyleType.parse>;
    marginTop: CSSValue;
    marginRight: CSSValue;
    marginBottom: CSSValue;
    marginLeft: CSSValue;
    opacity: ReturnType<typeof opacity.parse>;
    overflow: ReturnType<typeof overflow.parse>;
    overflowWrap: ReturnType<typeof overflowWrap.parse>;
    paddingTop: LengthPercentage;
    paddingRight: LengthPercentage;
    paddingBottom: LengthPercentage;
    paddingLeft: LengthPercentage;
    position: ReturnType<typeof position.parse>;
    textDecorationColor: Color;
    textDecorationLine: ReturnType<typeof textDecorationLine.parse>;
    textTransform: ReturnType<typeof textTransform.parse>;
    transform: ReturnType<typeof transform.parse>;
    transformOrigin: ReturnType<typeof transformOrigin.parse>;
    visibility: ReturnType<typeof visibility.parse>;
    wordBreak: ReturnType<typeof wordBreak.parse>;
    zIndex: ReturnType<typeof zIndex.parse>;

    constructor(declaration: CSSStyleDeclaration) {
        this.backgroundClip = this.parse(backgroundClip, declaration.backgroundClip);
        this.backgroundColor = this.parse(backgroundColor, declaration.backgroundColor);
        this.backgroundImage = this.parse(backgroundImage, declaration.backgroundImage);
        this.backgroundOrigin = this.parse(backgroundOrigin, declaration.backgroundOrigin);
        this.backgroundPosition = this.parse(backgroundPosition, declaration.backgroundPosition);
        this.backgroundRepeat = this.parse(backgroundRepeat, declaration.backgroundRepeat);
        this.backgroundSize = this.parse(backgroundSize, declaration.backgroundSize);
        this.borderTopColor = this.parse(borderTopColor, declaration.borderTopColor);
        this.borderRightColor = this.parse(borderRightColor, declaration.borderRightColor);
        this.borderBottomColor = this.parse(borderBottomColor, declaration.borderBottomColor);
        this.borderLeftColor = this.parse(borderLeftColor, declaration.borderLeftColor);
        this.borderTopLeftRadius = this.parse(borderTopLeftRadius, declaration.borderTopLeftRadius);
        this.borderTopRightRadius = this.parse(borderTopRightRadius, declaration.borderTopRightRadius);
        this.borderBottomRightRadius = this.parse(borderBottomRightRadius, declaration.borderBottomRightRadius);
        this.borderBottomLeftRadius = this.parse(borderBottomLeftRadius, declaration.borderBottomLeftRadius);
        this.borderTopStyle = this.parse(borderTopStyle, declaration.borderTopStyle);
        this.borderRightStyle = this.parse(borderRightStyle, declaration.borderRightStyle);
        this.borderBottomStyle = this.parse(borderBottomStyle, declaration.borderBottomStyle);
        this.borderLeftStyle = this.parse(borderLeftStyle, declaration.borderLeftStyle);
        this.borderTopWidth = this.parse(borderTopWidth, declaration.borderTopWidth);
        this.borderRightWidth = this.parse(borderRightWidth, declaration.borderRightWidth);
        this.borderBottomWidth = this.parse(borderBottomWidth, declaration.borderBottomWidth);
        this.borderLeftWidth = this.parse(borderLeftWidth, declaration.borderLeftWidth);
        this.color = this.parse(color, declaration.color);
        this.display = this.parse(display, declaration.display);
        this.float = this.parse(float, declaration.cssFloat);
        this.fontFamily = this.parse(fontFamily, declaration.fontFamily);
        this.fontSize = this.parse(fontSize, declaration.fontSize);
        this.fontStyle = this.parse(fontStyle, declaration.fontStyle);
        this.fontVariant = this.parse(fontVariant, declaration.fontVariant);
        this.fontWeight = this.parse(fontWeight, declaration.fontWeight);
        this.letterSpacing = this.parse(letterSpacing, declaration.letterSpacing);
        this.lineBreak = this.parse(lineBreak, declaration.lineBreak);
        this.listStylePosition = this.parse(listStylePosition, declaration.listStylePosition);
        this.listStyleType = this.parse(listStyleType, declaration.listStyleType);
        this.marginTop = this.parse(marginTop, declaration.marginTop);
        this.marginRight = this.parse(marginRight, declaration.marginRight);
        this.marginBottom = this.parse(paddingBottom, declaration.marginBottom);
        this.marginLeft = this.parse(paddingLeft, declaration.marginLeft);
        this.opacity = this.parse(opacity, declaration.opacity);
        this.overflow = this.parse(overflow, declaration.overflow);
        this.overflowWrap = this.parse(overflowWrap, declaration.overflowWrap);
        this.paddingTop = this.parse(paddingTop, declaration.paddingTop);
        this.paddingRight = this.parse(paddingRight, declaration.paddingRight);
        this.paddingBottom = this.parse(paddingBottom, declaration.paddingBottom);
        this.paddingLeft = this.parse(paddingLeft, declaration.paddingLeft);
        this.position = this.parse(position, declaration.position);
        this.textDecorationColor = this.parse(textDecorationColor, declaration.textDecorationColor || declaration.color);
        this.textDecorationLine = this.parse(textDecorationLine, declaration.textDecorationLine);
        this.textTransform = this.parse(textTransform, declaration.textTransform);
        this.transform = this.parse(transform, declaration.transform);
        this.transformOrigin = this.parse(transformOrigin, declaration.transformOrigin);
        this.visibility = this.parse(visibility, declaration.visibility);
        this.wordBreak = this.parse(wordBreak, declaration.wordBreak);
        this.zIndex = this.parse(zIndex, declaration.zIndex);
    }

    private parse(descriptor: CSSPropertyDescriptor<any>, style?: string | null) {
        const tokenizer = new Tokenizer();
        tokenizer.write(typeof style === 'string' ? style : descriptor.initialValue);
        const parser = new Parser(tokenizer.read());
        switch(descriptor.type) {
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
                switch(descriptor.format) {
                    case 'angle': return angle.parse(parser.parseComponentValue());
                    case 'color': return colorType.parse(parser.parseComponentValue());
                    case 'image': return image.parse(parser.parseComponentValue());
                    case 'length':
                        const length = parser.parseComponentValue();
                        return isLength(length) ? length : ZERO_LENGTH;
                    case 'length-percentage':
                        const value = parser.parseComponentValue();
                        return isLengthPercentage(value) ? value : ZERO_LENGTH;
                }
        }

        throw new Error(`Attempting to parse unsupported css format type ${descriptor.format}`);
    }

    isVisible(): boolean {
        return (
            this.display > 0 &&
            this.opacity > 0 &&
            this.visibility === VISIBILITY.VISIBLE
        );
    }

    isTransparent(): boolean {
        return isTransparent(this.backgroundColor)
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

export class CSS {
    static registeredPropertySet: {[key: string]: CSSPropertyDescriptor<any>} = {
        backgroundClip,
        backgroundColor,
        backgroundImage,
        backgroundOrigin,
        backgroundPosition,
        backgroundRepeat,
        backgroundSize,
        borderTopColor,
        borderRightColor,
        borderBottomColor,
        borderLeftColor,
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomRightRadius,
        borderBottomLeftRadius,
        borderTopStyle,
        borderRightStyle,
        borderBottomStyle,
        borderLeftStyle,
        borderTopWidth,
        borderRightWidth,
        borderBottomWidth,
        borderLeftWidth,
        color,
        display,
        float,
        letterSpacing,
        lineBreak,
        listStylePosition,
        listStyleType,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        overflow,
        overflowWrap,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        position,
        textTransform,
        transform,
        transformOrigin,
        visibility,
        wordBreak,
        zIndex
    };
}

