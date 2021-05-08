import {CSSValue, nonFunctionArgSeparator} from '../syntax/parser';
import {TokenType} from '../syntax/tokenizer';
import {ITypeDescriptor} from '../ITypeDescriptor';
import {angle, deg} from './angle';
import {getAbsoluteValue, isLengthPercentage} from './length-percentage';
export type Color = number;

export const color: ITypeDescriptor<Color> = {
    name: 'color',
    parse: (value: CSSValue): Color => {
        if (value.type === TokenType.FUNCTION) {
            const colorFunction = SUPPORTED_COLOR_FUNCTIONS[value.name];
            if (typeof colorFunction === 'undefined') {
                throw new Error(`Attempting to parse an unsupported color function "${value.name}"`);
            }
            return colorFunction(value.values);
        }

        if (value.type === TokenType.HASH_TOKEN) {
            if (value.value.length === 3) {
                const r = value.value.substring(0, 1);
                const g = value.value.substring(1, 2);
                const b = value.value.substring(2, 3);
                return pack(parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16), 1);
            }

            if (value.value.length === 4) {
                const r = value.value.substring(0, 1);
                const g = value.value.substring(1, 2);
                const b = value.value.substring(2, 3);
                const a = value.value.substring(3, 4);
                return pack(parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16), parseInt(a + a, 16) / 255);
            }

            if (value.value.length === 6) {
                const r = value.value.substring(0, 2);
                const g = value.value.substring(2, 4);
                const b = value.value.substring(4, 6);
                return pack(parseInt(r, 16), parseInt(g, 16), parseInt(b, 16), 1);
            }

            if (value.value.length === 8) {
                const r = value.value.substring(0, 2);
                const g = value.value.substring(2, 4);
                const b = value.value.substring(4, 6);
                const a = value.value.substring(6, 8);
                return pack(parseInt(r, 16), parseInt(g, 16), parseInt(b, 16), parseInt(a, 16) / 255);
            }
        }

        if (value.type === TokenType.IDENT_TOKEN) {
            const namedColor = COLORS[value.value.toUpperCase()];
            if (typeof namedColor !== 'undefined') {
                return namedColor;
            }
        }

        return COLORS.TRANSPARENT;
    }
};

export const isTransparent = (color: Color) => (0xff & color) === 0;

export const asString = (color: Color) => {
    const alpha = 0xff & color;
    const blue = 0xff & (color >> 8);
    const green = 0xff & (color >> 16);
    const red = 0xff & (color >> 24);
    return alpha < 255 ? `rgba(${red},${green},${blue},${alpha / 255})` : `rgb(${red},${green},${blue})`;
};

export const pack = (r: number, g: number, b: number, a: number): Color =>
    ((r << 24) | (g << 16) | (b << 8) | (Math.round(a * 255) << 0)) >>> 0;

const getTokenColorValue = (token: CSSValue, i: number): number => {
    if (token.type === TokenType.NUMBER_TOKEN) {
        return token.number;
    }

    if (token.type === TokenType.PERCENTAGE_TOKEN) {
        const max = i === 3 ? 1 : 255;
        return i === 3 ? (token.number / 100) * max : Math.round((token.number / 100) * max);
    }

    return 0;
};

const rgb = (args: CSSValue[]): number => {
    const tokens = args.filter(nonFunctionArgSeparator);

    if (tokens.length === 3) {
        const [r, g, b] = tokens.map(getTokenColorValue);
        return pack(r, g, b, 1);
    }

    if (tokens.length === 4) {
        const [r, g, b, a] = tokens.map(getTokenColorValue);
        return pack(r, g, b, a);
    }

    return 0;
};

function hue2rgb(t1: number, t2: number, hue: number): number {
    if (hue < 0) {
        hue += 1;
    }
    if (hue >= 1) {
        hue -= 1;
    }

    if (hue < 1 / 6) {
        return (t2 - t1) * hue * 6 + t1;
    } else if (hue < 1 / 2) {
        return t2;
    } else if (hue < 2 / 3) {
        return (t2 - t1) * 6 * (2 / 3 - hue) + t1;
    } else {
        return t1;
    }
}

const hsl = (args: CSSValue[]): number => {
    const tokens = args.filter(nonFunctionArgSeparator);
    const [hue, saturation, lightness, alpha] = tokens;

    const h = (hue.type === TokenType.NUMBER_TOKEN ? deg(hue.number) : angle.parse(hue)) / (Math.PI * 2);
    const s = isLengthPercentage(saturation) ? saturation.number / 100 : 0;
    const l = isLengthPercentage(lightness) ? lightness.number / 100 : 0;
    const a = typeof alpha !== 'undefined' && isLengthPercentage(alpha) ? getAbsoluteValue(alpha, 1) : 1;

    if (s === 0) {
        return pack(l * 255, l * 255, l * 255, 1);
    }

    const t2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;

    const t1 = l * 2 - t2;
    const r = hue2rgb(t1, t2, h + 1 / 3);
    const g = hue2rgb(t1, t2, h);
    const b = hue2rgb(t1, t2, h - 1 / 3);
    return pack(r * 255, g * 255, b * 255, a);
};

const SUPPORTED_COLOR_FUNCTIONS: {
    [key: string]: (args: CSSValue[]) => number;
} = {
    hsl: hsl,
    hsla: hsl,
    rgb: rgb,
    rgba: rgb
};

export const COLORS: {[key: string]: Color} = {
    ALICEBLUE: 0xf0f8ffff,
    ANTIQUEWHITE: 0xfaebd7ff,
    AQUA: 0x00ffffff,
    AQUAMARINE: 0x7fffd4ff,
    AZURE: 0xf0ffffff,
    BEIGE: 0xf5f5dcff,
    BISQUE: 0xffe4c4ff,
    BLACK: 0x000000ff,
    BLANCHEDALMOND: 0xffebcdff,
    BLUE: 0x0000ffff,
    BLUEVIOLET: 0x8a2be2ff,
    BROWN: 0xa52a2aff,
    BURLYWOOD: 0xdeb887ff,
    CADETBLUE: 0x5f9ea0ff,
    CHARTREUSE: 0x7fff00ff,
    CHOCOLATE: 0xd2691eff,
    CORAL: 0xff7f50ff,
    CORNFLOWERBLUE: 0x6495edff,
    CORNSILK: 0xfff8dcff,
    CRIMSON: 0xdc143cff,
    CYAN: 0x00ffffff,
    DARKBLUE: 0x00008bff,
    DARKCYAN: 0x008b8bff,
    DARKGOLDENROD: 0xb886bbff,
    DARKGRAY: 0xa9a9a9ff,
    DARKGREEN: 0x006400ff,
    DARKGREY: 0xa9a9a9ff,
    DARKKHAKI: 0xbdb76bff,
    DARKMAGENTA: 0x8b008bff,
    DARKOLIVEGREEN: 0x556b2fff,
    DARKORANGE: 0xff8c00ff,
    DARKORCHID: 0x9932ccff,
    DARKRED: 0x8b0000ff,
    DARKSALMON: 0xe9967aff,
    DARKSEAGREEN: 0x8fbc8fff,
    DARKSLATEBLUE: 0x483d8bff,
    DARKSLATEGRAY: 0x2f4f4fff,
    DARKSLATEGREY: 0x2f4f4fff,
    DARKTURQUOISE: 0x00ced1ff,
    DARKVIOLET: 0x9400d3ff,
    DEEPPINK: 0xff1493ff,
    DEEPSKYBLUE: 0x00bfffff,
    DIMGRAY: 0x696969ff,
    DIMGREY: 0x696969ff,
    DODGERBLUE: 0x1e90ffff,
    FIREBRICK: 0xb22222ff,
    FLORALWHITE: 0xfffaf0ff,
    FORESTGREEN: 0x228b22ff,
    FUCHSIA: 0xff00ffff,
    GAINSBORO: 0xdcdcdcff,
    GHOSTWHITE: 0xf8f8ffff,
    GOLD: 0xffd700ff,
    GOLDENROD: 0xdaa520ff,
    GRAY: 0x808080ff,
    GREEN: 0x008000ff,
    GREENYELLOW: 0xadff2fff,
    GREY: 0x808080ff,
    HONEYDEW: 0xf0fff0ff,
    HOTPINK: 0xff69b4ff,
    INDIANRED: 0xcd5c5cff,
    INDIGO: 0x4b0082ff,
    IVORY: 0xfffff0ff,
    KHAKI: 0xf0e68cff,
    LAVENDER: 0xe6e6faff,
    LAVENDERBLUSH: 0xfff0f5ff,
    LAWNGREEN: 0x7cfc00ff,
    LEMONCHIFFON: 0xfffacdff,
    LIGHTBLUE: 0xadd8e6ff,
    LIGHTCORAL: 0xf08080ff,
    LIGHTCYAN: 0xe0ffffff,
    LIGHTGOLDENRODYELLOW: 0xfafad2ff,
    LIGHTGRAY: 0xd3d3d3ff,
    LIGHTGREEN: 0x90ee90ff,
    LIGHTGREY: 0xd3d3d3ff,
    LIGHTPINK: 0xffb6c1ff,
    LIGHTSALMON: 0xffa07aff,
    LIGHTSEAGREEN: 0x20b2aaff,
    LIGHTSKYBLUE: 0x87cefaff,
    LIGHTSLATEGRAY: 0x778899ff,
    LIGHTSLATEGREY: 0x778899ff,
    LIGHTSTEELBLUE: 0xb0c4deff,
    LIGHTYELLOW: 0xffffe0ff,
    LIME: 0x00ff00ff,
    LIMEGREEN: 0x32cd32ff,
    LINEN: 0xfaf0e6ff,
    MAGENTA: 0xff00ffff,
    MAROON: 0x800000ff,
    MEDIUMAQUAMARINE: 0x66cdaaff,
    MEDIUMBLUE: 0x0000cdff,
    MEDIUMORCHID: 0xba55d3ff,
    MEDIUMPURPLE: 0x9370dbff,
    MEDIUMSEAGREEN: 0x3cb371ff,
    MEDIUMSLATEBLUE: 0x7b68eeff,
    MEDIUMSPRINGGREEN: 0x00fa9aff,
    MEDIUMTURQUOISE: 0x48d1ccff,
    MEDIUMVIOLETRED: 0xc71585ff,
    MIDNIGHTBLUE: 0x191970ff,
    MINTCREAM: 0xf5fffaff,
    MISTYROSE: 0xffe4e1ff,
    MOCCASIN: 0xffe4b5ff,
    NAVAJOWHITE: 0xffdeadff,
    NAVY: 0x000080ff,
    OLDLACE: 0xfdf5e6ff,
    OLIVE: 0x808000ff,
    OLIVEDRAB: 0x6b8e23ff,
    ORANGE: 0xffa500ff,
    ORANGERED: 0xff4500ff,
    ORCHID: 0xda70d6ff,
    PALEGOLDENROD: 0xeee8aaff,
    PALEGREEN: 0x98fb98ff,
    PALETURQUOISE: 0xafeeeeff,
    PALEVIOLETRED: 0xdb7093ff,
    PAPAYAWHIP: 0xffefd5ff,
    PEACHPUFF: 0xffdab9ff,
    PERU: 0xcd853fff,
    PINK: 0xffc0cbff,
    PLUM: 0xdda0ddff,
    POWDERBLUE: 0xb0e0e6ff,
    PURPLE: 0x800080ff,
    REBECCAPURPLE: 0x663399ff,
    RED: 0xff0000ff,
    ROSYBROWN: 0xbc8f8fff,
    ROYALBLUE: 0x4169e1ff,
    SADDLEBROWN: 0x8b4513ff,
    SALMON: 0xfa8072ff,
    SANDYBROWN: 0xf4a460ff,
    SEAGREEN: 0x2e8b57ff,
    SEASHELL: 0xfff5eeff,
    SIENNA: 0xa0522dff,
    SILVER: 0xc0c0c0ff,
    SKYBLUE: 0x87ceebff,
    SLATEBLUE: 0x6a5acdff,
    SLATEGRAY: 0x708090ff,
    SLATEGREY: 0x708090ff,
    SNOW: 0xfffafaff,
    SPRINGGREEN: 0x00ff7fff,
    STEELBLUE: 0x4682b4ff,
    TAN: 0xd2b48cff,
    TEAL: 0x008080ff,
    THISTLE: 0xd8bfd8ff,
    TOMATO: 0xff6347ff,
    TRANSPARENT: 0x00000000,
    TURQUOISE: 0x40e0d0ff,
    VIOLET: 0xee82eeff,
    WHEAT: 0xf5deb3ff,
    WHITE: 0xffffffff,
    WHITESMOKE: 0xf5f5f5ff,
    YELLOW: 0xffff00ff,
    YELLOWGREEN: 0x9acd32ff
};

export interface RGBColor {
    r: number;
    g: number;
    b: number;
}

export const contrastRGB = (rgb: RGBColor, value: number): RGBColor => {
    if (value < 0) value = 0;
    else if (value > 1) value = 1;
    return {
        r: Math.max(0, Math.min(255, value * (rgb.r - 128) + 128)),
        g: Math.max(0, Math.min(255, value * (rgb.g - 128) + 128)),
        b: Math.max(0, Math.min(255, value * (rgb.b - 128) + 128))
    };
};

export const grayscaleRGB = (rgb: RGBColor, value: number, mode?: string | null) => {
    var gray = 0;
    //different grayscale algorithms
    switch (mode) {
        case 'average':
            gray = (rgb.r + rgb.g + rgb.b) / 3;
            break;
        case 'luma:BT601':
            gray = rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114;
            break;
        case 'desaturation':
            gray = (Math.max(rgb.r, rgb.g, rgb.b) + Math.max(rgb.r, rgb.g, rgb.b)) / 2;
            break;
        case 'decompsition:max':
            gray = Math.max(rgb.r, rgb.g, rgb.b);
            break;
        case 'decompsition:min':
            gray = Math.min(rgb.r, rgb.g, rgb.b);
            break;
        case 'luma:BT709':
        default:
            gray = rgb.r * 0.2126 + rgb.g * 0.7152 + rgb.b * 0.0722;
            break;
    }
    rgb.r = value * (gray - rgb.r) + rgb.r;
    rgb.g = value * (gray - rgb.g) + rgb.g;
    rgb.b = value * (gray - rgb.b) + rgb.b;
    return rgb;
};

export const brightnessRGB = (rgb: RGBColor, value: number): RGBColor => {
    if (value < 0) value = 0;
    return {
        r: Math.max(0, Math.min(255, rgb.r * value)),
        g: Math.max(0, Math.min(255, rgb.g * value)),
        b: Math.max(0, Math.min(255, rgb.b * value))
    };
};

export const invertRGB = (rgb: RGBColor, value: number): RGBColor => {
    return {
        r: value * (255 - 2 * rgb.r) + rgb.r,
        g: value * (255 - 2 * rgb.g) + rgb.g,
        b: value * (255 - 2 * rgb.b) + rgb.b
    };
};

export const sepiaRGB = (rgb: RGBColor, value: number): RGBColor => {
    if (value < 0) value = 0;
    else if (value > 1) value = 1;
    return {
        r: value * Math.min(255, rgb.r * 0.393 + rgb.g * 0.769 + rgb.b * 0.189 - rgb.r) + rgb.r,
        g: value * Math.min(255, rgb.r * 0.349 + rgb.g * 0.686 + rgb.b * 0.168 - rgb.g) + rgb.g,
        b: value * Math.min(255, rgb.r * 0.272 + rgb.g * 0.534 + rgb.b * 0.131 - rgb.b) + rgb.b
    };
};

export const hueRotateRGB = (rgb: RGBColor, value: number): RGBColor => {
    while (value < 0) value += 360;
    while (value > 360) value -= 360;
    rgb2hsl(rgb);
    rgb.r += value;
    if (rgb.r < 0) rgb.r += 360;
    if (rgb.r > 359) rgb.r -= 360;
    hsl2rgb(rgb);
    return rgb;
};

export const saturateRGB = (rgb: RGBColor, value: number): RGBColor => {
    if (value < 0) value = 0;
    rgb2hsl(rgb);
    rgb.g *= value;
    if (rgb.g > 100) rgb.g = 100;
    hsl2rgb(rgb);
    return rgb;
};

function rgb2hsl(rgb: RGBColor) {
    rgb.r = Math.max(0, Math.min(255, rgb.r)) / 255;
    rgb.g = Math.max(0, Math.min(255, rgb.g)) / 255;
    rgb.b = Math.max(0, Math.min(255, rgb.b)) / 255;
    let h, l;
    let M = Math.max(rgb.r, rgb.g, rgb.b);
    let m = Math.min(rgb.r, rgb.g, rgb.b);
    let d = M - m;
    if (d == 0) h = 0;
    else if (M == rgb.r) h = ((rgb.g - rgb.b) / d) % 6;
    else if (M == rgb.g) h = (rgb.b - rgb.r) / d + 2;
    else h = (rgb.r - rgb.g) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    rgb.r = h;
    l = (M + m) / 2;
    if (d == 0) rgb.g = 0;
    else rgb.g = (d / (1 - Math.abs(2 * l - 1))) * 100;
    rgb.b = l * 100;
}

function hsl2rgb(rgb: RGBColor) {
    rgb.r = Math.max(0, Math.min(359, rgb.r));
    rgb.g = Math.max(0, Math.min(100, rgb.g)) / 100;
    rgb.b = Math.max(0, Math.min(100, rgb.b)) / 100;
    let C = (1 - Math.abs(2 * rgb.b - 1)) * rgb.g;
    let h = rgb.r / 60;
    let X = C * (1 - Math.abs((h % 2) - 1));
    let l = rgb.b;
    rgb.r = 0;
    rgb.g = 0;
    rgb.b = 0;
    if (h >= 0 && h < 1) {
        rgb.r = C;
        rgb.g = X;
    } else if (h >= 1 && h < 2) {
        rgb.r = X;
        rgb.g = C;
    } else if (h >= 2 && h < 3) {
        rgb.g = C;
        rgb.b = X;
    } else if (h >= 3 && h < 4) {
        rgb.g = X;
        rgb.b = C;
    } else if (h >= 4 && h < 5) {
        rgb.r = X;
        rgb.b = C;
    } else {
        rgb.r = C;
        rgb.b = X;
    }
    let m = l - C / 2;
    rgb.r += m;
    rgb.g += m;
    rgb.b += m;
    rgb.r = Math.round(rgb.r * 255.0);
    rgb.g = Math.round(rgb.g * 255.0);
    rgb.b = Math.round(rgb.b * 255.0);
}
