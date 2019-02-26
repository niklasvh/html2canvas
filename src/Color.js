/* @flow */
'use strict';

// http://dev.w3.org/csswg/css-color/

type ColorArray = [number, number, number, number | null];

const HEX3 = /^#([a-f0-9]{3})$/i;
const hex3 = (value: string): ColorArray | false => {
    const match = value.match(HEX3);
    if (match) {
        return [
            parseInt(match[1][0] + match[1][0], 16),
            parseInt(match[1][1] + match[1][1], 16),
            parseInt(match[1][2] + match[1][2], 16),
            null
        ];
    }
    return false;
};

const HEX6 = /^#([a-f0-9]{6})$/i;
const hex6 = (value: string): ColorArray | false => {
    const match = value.match(HEX6);
    if (match) {
        return [
            parseInt(match[1].substring(0, 2), 16),
            parseInt(match[1].substring(2, 4), 16),
            parseInt(match[1].substring(4, 6), 16),
            null
        ];
    }
    return false;
};

const RGB = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
const rgb = (value: string): ColorArray | false => {
    const match = value.match(RGB);
    if (match) {
        return [Number(match[1]), Number(match[2]), Number(match[3]), null];
    }
    return false;
};

const RGBA = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d?\.?\d+)\s*\)$/;
const rgba = (value: string): ColorArray | false => {
    const match = value.match(RGBA);
    if (match && match.length > 4) {
        return [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])];
    }
    return false;
};

const fromArray = (array: Array<number>): ColorArray => {
    return [
        Math.min(array[0], 255),
        Math.min(array[1], 255),
        Math.min(array[2], 255),
        array.length > 3 ? array[3] : null
    ];
};

const namedColor = (name: string): ColorArray | false => {
    const color: ColorArray | void = NAMED_COLORS[name.toLowerCase()];
    return color ? color : false;
};

export default class Color {
    r: number;
    g: number;
    b: number;
    a: number | null;
    k: number;
    isHSL: boolean;
    isHSV: boolean;
    isCMYK: boolean;
    isRGB: boolean;

    constructor(value: string | Array<number>) {
        const [r, g, b, a] = Array.isArray(value)
            ? fromArray(value)
            : hex3(value) ||
              rgb(value) ||
              rgba(value) ||
              namedColor(value) ||
              hex6(value) || [0, 0, 0, null];
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.k = 0;
        this.isHSL = false;
        this.isHSV = false;
        this.isCMYK = false;
        this.isRGB = true;
    }

    isTransparent(): boolean {
        return this.a === 0;
    }

    toString(): string {
        return this.a !== null && this.a !== 1
            ? `rgba(${this.r},${this.g},${this.b},${this.a})`
            : `rgb(${this.r},${this.g},${this.b})`;
    }

    hsl2rgb() {
        if (this.isRGB) return;
        if (!this.isHSL) return;
        this.r = Math.max(0, Math.min(359, this.r));
        this.g = Math.max(0, Math.min(100, this.g));
        this.b = Math.max(0, Math.min(100, this.b));
        this.g /= 100;
        this.b /= 100;
        var C = (1 - Math.abs(2 * this.b - 1)) * this.g;
        var h = this.r / 60;
        var X = C * (1 - Math.abs(h % 2 - 1));
        var l = this.b;
        this.r = 0;
        this.g = 0;
        this.b = 0;
        if (h >= 0 && h < 1) {
            this.r = C;
            this.g = X;
        } else if (h >= 1 && h < 2) {
            this.r = X;
            this.g = C;
        } else if (h >= 2 && h < 3) {
            this.g = C;
            this.b = X;
        } else if (h >= 3 && h < 4) {
            this.g = X;
            this.b = C;
        } else if (h >= 4 && h < 5) {
            this.r = X;
            this.b = C;
        } else {
            this.r = C;
            this.b = X;
        }
        var m = l - C / 2;
        this.r += m;
        this.g += m;
        this.b += m;
        this.r = Math.round(this.r * 255.0);
        this.g = Math.round(this.g * 255.0);
        this.b = Math.round(this.b * 255.0);
        this.isHSL = false;
        this.isRGB = true;
    }

    hsv2rgb() {
        if (this.isRGB) return;
        if (!this.isHSV) return;
        this.r = Math.max(0, Math.min(359, this.r));
        this.g = Math.max(0, Math.min(100, this.g));
        this.b = Math.max(0, Math.min(100, this.b));
        this.g /= 100;
        this.b /= 100;
        var C = this.g * this.b;
        var h = this.r / 60;
        var X = C * (1 - Math.abs(h % 2 - 1));
        var v = this.b;
        this.r = 0;
        this.g = 0;
        this.b = 0;
        if (h >= 0 && h < 1) {
            this.r = C;
            this.g = X;
        } else if (h >= 1 && h < 2) {
            this.r = X;
            this.g = C;
        } else if (h >= 2 && h < 3) {
            this.g = C;
            this.b = X;
        } else if (h >= 3 && h < 4) {
            this.g = X;
            this.b = C;
        } else if (h >= 4 && h < 5) {
            this.r = X;
            this.b = C;
        } else {
            this.r = C;
            this.b = X;
        }
        var m = v - C;
        this.r += m;
        this.g += m;
        this.b += m;
        this.r = Math.round(this.r * 255.0);
        this.g = Math.round(this.g * 255.0);
        this.b = Math.round(this.b * 255.0);
        this.isHSV = false;
        this.isRGB = true;
    }

    cmyk2rgb() {
        if (this.isRGB) return;
        if (!this.isCMYK) return;
        this.r = Math.max(0, Math.min(100, this.r)) / 100;
        this.g = Math.max(0, Math.min(100, this.g)) / 100;
        this.b = Math.max(0, Math.min(100, this.b)) / 100;
        this.k = Math.max(0, Math.min(100, this.k)) / 100;
        this.r = Math.round((1 - this.r) * (1 - this.k) * 255);
        this.g = Math.round((1 - this.g) * (1 - this.k) * 255);
        this.b = Math.round((1 - this.b) * (1 - this.k) * 255);
        this.isCMYK = false;
        this.isRGB = true;
    }

    rgb2hsl() {
        if (this.isHSL) return;
        if (!this.isRGB) return;
        this.r = Math.max(0, Math.min(255, this.r));
        this.g = Math.max(0, Math.min(255, this.g));
        this.b = Math.max(0, Math.min(255, this.b));
        this.r /= 255;
        this.g /= 255;
        this.b /= 255;
        var h, l, s;
        var M = Math.max(this.r, this.g, this.b);
        var m = Math.min(this.r, this.g, this.b);
        var d = M - m;
        if (d == 0) h = 0;
        else if (M == this.r) h = (this.g - this.b) / d % 6;
        else if (M == this.g) h = (this.b - this.r) / d + 2;
        else h = (this.r - this.g) / d + 4;
        h *= 60;
        if (h < 0) h += 360;
        this.r = h;
        l = (M + m) / 2;
        if (d == 0) this.g = 0;
        else this.g = d / (1 - Math.abs(2 * l - 1)) * 100;
        this.b = l * 100;
        this.isHSL = true;
        this.isRGB = false;
    }

    rgb2hsv() {
        if (this.isHSV) return;
        if (!this.isRGB) return;
        this.r = Math.max(0, Math.min(255, this.r));
        this.g = Math.max(0, Math.min(255, this.g));
        this.b = Math.max(0, Math.min(255, this.b));
        this.r /= 255;
        this.g /= 255;
        this.b /= 255;
        var M = Math.max(this.r, this.g, this.b);
        var m = Math.min(this.r, this.g, this.b);
        var C = M - m;
        var h, s;
        if (C == 0) h = 0;
        else if (M == this.r) h = (this.g - this.b) / C % 6;
        else if (M == this.g) h = (this.b - this.r) / C + 2;
        else h = (this.r - this.g) / C + 4;
        h *= 60;
        if (h < 0) h += 360;
        this.r = h;
        //var v = M;
        if (M == 0) this.g = 0;
        else this.g = C / M * 100;
        this.b = M * 100;
        this.isHSV = true;
        this.isRGB = false;
    }

    rgb2cmyk() {
        if (this.isCMYK) return;
        if (!this.isRGB) return;
        this.r = Math.max(0, Math.min(255, this.r));
        this.g = Math.max(0, Math.min(255, this.g));
        this.b = Math.max(0, Math.min(255, this.b));
        this.r /= 255;
        this.g /= 255;
        this.b /= 255;
        this.k = 1 - Math.max(this.r, this.g, this.b);
        if (this.k == 1) {
            this.r = 0;
            this.g = 0;
            this.b = 0;
        } else {
            this.r = Math.round((1 - this.r - this.k) / (1 - this.k) * 100);
            this.g = Math.round((1 - this.g - this.k) / (1 - this.k) * 100);
            this.b = Math.round((1 - this.b - this.k) / (1 - this.k) * 100);
        }
        this.k = Math.round(this.k * 100);
        this.isCMYK = true;
        this.isRGB = false;
    }

    blend(color: Color, opacity){
        if (opacity > 1) opacity /= 255;
        this.r = opacity * (this.r - color.r) + color.r;
        this.g = opacity * (this.g - color.g) + color.g;
        this.b = opacity * (this.b - color.b) + color.b;
        this.a = 255;
    }

    clip(){
      if(this.r > 255) this.r = 255;
      if(this.g > 255) this.g = 255;
      if(this.b > 255) this.b = 255;
      if(this.a > 255) this.a = 255;
      if(this.r < 0) this.r = 0;
      if(this.g < 0) this.g = 0;
      if(this.b < 0) this.b = 0;
      if(this.a < 0) this.a = 0;
    }

    adjustBrightness(value: number) {
        if (value < 0) value = 0;
        if (this.isCMYK) {
            this.cmyk2rgb();
            this.rgb2hsl();
            this.b *= value;
            this.hsl2rgb();
            this.rgb2cmyk();
        } else if (this.isRGB) {
            this.rgb2hsl();
            this.b *= value;
            this.hsl2rgb();
        } else if (this.isHSV) {
            //this.hsv2rgb();
            //this.rgb2hsl();
            this.b *= value;
            //this.hsl2rgb();
            //this.rgb2hsv();
        } else if (this.isHSL) this.b *= value;
    }

    brightnessRGB(value: number) {
        this.r = Math.max(0, Math.min(255, this.r * value));
        this.g = Math.max(0, Math.min(255, this.g * value));
        this.b = Math.max(0, Math.min(255, this.b * value));
    }

    adjustBrightnessRGB(value: number) {
        if (value < 0) value = 0;
        if (this.isCMYK) {
            this.cmyk2rgb();
            this.brightnessRGB(value);
            this.rgb2cmyk();
        } else if (this.isHSL) {
            this.hsl2rgb();
            this.brightnessRGB(value);
            this.rgb2hsl();
        } else if (this.isHSV) {
            this.hsv2rgb();
            this.brightnessRGB(value);
            this.rgb2hsv();
        } else if (this.isRGB) {
            this.brightnessRGB(value);
        }
    }

    contrastRGB(value: number) {
        this.r = Math.max(0, Math.min(255, value * (this.r - 128) + 128));
        this.g = Math.max(0, Math.min(255, value * (this.g - 128) + 128));
        this.b = Math.max(0, Math.min(255, value * (this.b - 128) + 128));
    }

    adjustContrast(value: number) {
        if (value < 0) value = 0;
        else if (value > 1) value = 1;
        if (this.isCMYK) {
            this.cmyk2rgb();
            this.contrastRGB(value);
            this.rgb2cmyk();
        } else if (this.isHSL) {
            this.hsl2rgb();
            this.contrastRGB(value);
            this.rgb2hsl();
        } else if (this.isHSV) {
            this.hsv2rgb();
            this.contrastRGB(value);
            this.rgb2hsv();
        } else if (this.isRGB) {
            this.contrastRGB(value);
        }
    }

    grayscaleRGB(value: number, mode: ?string) {
        var gray = 0;
        //different grayscale algorithms
        switch (mode) {
            case 'average':
                gray = (this.r + this.g + this.b) / 3;
                break;
            case 'luma:BT601':
                gray = this.r * 0.299 + this.g * 0.587 + this.b * 0.114;
                break;
            case 'desaturation':
                gray = (Math.max(this.r, this.g, this.b) + Math.max(this.r, this.g, this.b)) / 2;
                break;
            case 'decompsition:max':
                gray = Math.max(this.r, this.g, this.b);
                break;
            case 'decompsition:min':
                gray = Math.min(this.r, this.g, this.b);
                break;
            case 'luma:BT709':
            default:
                gray = this.r * 0.2126 + this.g * 0.7152 + this.b * 0.0722;
                break;
        }
        this.r = value * (gray - this.r) + this.r;
        this.g = value * (gray - this.g) + this.g;
        this.b = value * (gray - this.b) + this.b;
    }

    grayscale(value: number, mode: ?string) {
        if (this.isCMYK) {
            this.cmyk2rgb();
            this.grayscaleRGB(value, mode);
            this.rgb2cmyk();
        } else if (this.isHSL) {
            this.hsl2rgb();
            this.grayscaleRGB(value, mode);
            this.rgb2hsl();
        } else if (this.isHSV) {
            this.hsv2rgb();
            this.grayscaleRGB(value, mode);
            this.rgb2hsv();
        } else if (this.isRGB) {
            this.grayscaleRGB(value, mode);
        }
    }

    adjustHue(value: number) {
        while (value < 0) value += 360;
        while (value > 360) value -= 360;
        if (this.isCMYK) {
            this.cmyk2rgb();
            this.rgb2hsl();
            this.r += value;
            if (this.r < 0) this.r += 360;
            if (this.r > 359) this.r -= 360;
            this.hsl2rgb();
            this.rgb2cmyk();
        } else if (this.isRGB) {
            this.rgb2hsl();
            this.r += value;
            if (this.r < 0) this.r += 360;
            if (this.r > 359) this.r -= 360;
            this.hsl2rgb();
        } else if (this.isHSV) {
            this.r += value;
            if (this.r < 0) this.r += 360;
            if (this.r > 359) this.r -= 360;
        } else if (this.isHSL) {
            this.r += value;
            if (this.r < 0) this.r += 360;
            if (this.r > 359) this.r -= 360;
        }
    }

    invert(value: number) {
        if (this.isRGB) {
            this.r = value * (255 - 2 * this.r) + this.r;
            this.g = value * (255 - 2 * this.g) + this.g;
            this.b = value * (255 - 2 * this.b) + this.b;
        } else if (this.isHSL || this.isHSV) {
            this.r = value * (360 - 2 * this.r) + this.r;
            this.g = value * (100 - 2 * this.g) + this.g;
            this.b = value * (100 - 2 * this.b) + this.b;
        } else if (this.isCMYK) {
            this.r = value * (255 - 2 * this.r) + this.r;
            this.g = value * (255 - 2 * this.g) + this.g;
            this.b = value * (255 - 2 * this.b) + this.b;
            //this.k = 1 - this.k;
        }
    }

    adjustSaturation(value: number) {
        while (value < 0) value = 0;
        if (this.isCMYK) {
            this.cmyk2rgb();
            this.rgb2hsl();
            this.g *= value;
            if (this.g > 100) this.g = 100;
            this.hsl2rgb();
            this.rgb2cmyk();
        } else if (this.isHSL) {
            this.g *= value;
            if (this.g > 100) this.g = 100;
        } else if (this.isHSV) {
            this.g *= value;
            if (this.g > 100) this.g = 100;
        } else {
            this.rgb2hsl();
            this.g *= value;
            if (this.g > 100) this.g = 100;
            this.hsl2rgb();
        }
    }

    sepiaRGB(value: number) {
        this.r =
            value * Math.min(255, this.r * 0.393 + this.g * 0.769 + this.b * 0.189 - this.r) +
            this.r;
        this.g =
            value * Math.min(255, this.r * 0.349 + this.g * 0.686 + this.b * 0.168 - this.g) +
            this.g;
        this.b =
            value * Math.min(255, this.r * 0.272 + this.g * 0.534 + this.b * 0.131 - this.b) +
            this.b;
    }

    adjustSepia(value: number) {
        if (value < 0) value = 0;
        else if (value > 1) value = 1;
        if (this.isRGB) {
            this.sepiaRGB(value);
        } else if (this.isCMYK) {
            this.cmyk2rgb();
            this.sepiaRGB(value);
            this.rgb2cmyk();
        } else if (this.isHSL) {
            this.hsl2rgb();
            this.sepiaRGB(value);
            this.rgb2hsl();
        } else if (this.isHSV) {
            this.hsv2rgb();
            this.sepiaRGB(value);
            this.rgb2hsv();
        }
    }

    static create(s): Color {
        return new Color(s);
    }
}

const NAMED_COLORS = {
    transparent: [0, 0, 0, 0],
    aliceblue: [240, 248, 255, null],
    antiquewhite: [250, 235, 215, null],
    aqua: [0, 255, 255, null],
    aquamarine: [127, 255, 212, null],
    azure: [240, 255, 255, null],
    beige: [245, 245, 220, null],
    bisque: [255, 228, 196, null],
    black: [0, 0, 0, null],
    blanchedalmond: [255, 235, 205, null],
    blue: [0, 0, 255, null],
    blueviolet: [138, 43, 226, null],
    brown: [165, 42, 42, null],
    burlywood: [222, 184, 135, null],
    cadetblue: [95, 158, 160, null],
    chartreuse: [127, 255, 0, null],
    chocolate: [210, 105, 30, null],
    coral: [255, 127, 80, null],
    cornflowerblue: [100, 149, 237, null],
    cornsilk: [255, 248, 220, null],
    crimson: [220, 20, 60, null],
    cyan: [0, 255, 255, null],
    darkblue: [0, 0, 139, null],
    darkcyan: [0, 139, 139, null],
    darkgoldenrod: [184, 134, 11, null],
    darkgray: [169, 169, 169, null],
    darkgreen: [0, 100, 0, null],
    darkgrey: [169, 169, 169, null],
    darkkhaki: [189, 183, 107, null],
    darkmagenta: [139, 0, 139, null],
    darkolivegreen: [85, 107, 47, null],
    darkorange: [255, 140, 0, null],
    darkorchid: [153, 50, 204, null],
    darkred: [139, 0, 0, null],
    darksalmon: [233, 150, 122, null],
    darkseagreen: [143, 188, 143, null],
    darkslateblue: [72, 61, 139, null],
    darkslategray: [47, 79, 79, null],
    darkslategrey: [47, 79, 79, null],
    darkturquoise: [0, 206, 209, null],
    darkviolet: [148, 0, 211, null],
    deeppink: [255, 20, 147, null],
    deepskyblue: [0, 191, 255, null],
    dimgray: [105, 105, 105, null],
    dimgrey: [105, 105, 105, null],
    dodgerblue: [30, 144, 255, null],
    firebrick: [178, 34, 34, null],
    floralwhite: [255, 250, 240, null],
    forestgreen: [34, 139, 34, null],
    fuchsia: [255, 0, 255, null],
    gainsboro: [220, 220, 220, null],
    ghostwhite: [248, 248, 255, null],
    gold: [255, 215, 0, null],
    goldenrod: [218, 165, 32, null],
    gray: [128, 128, 128, null],
    green: [0, 128, 0, null],
    greenyellow: [173, 255, 47, null],
    grey: [128, 128, 128, null],
    honeydew: [240, 255, 240, null],
    hotpink: [255, 105, 180, null],
    indianred: [205, 92, 92, null],
    indigo: [75, 0, 130, null],
    ivory: [255, 255, 240, null],
    khaki: [240, 230, 140, null],
    lavender: [230, 230, 250, null],
    lavenderblush: [255, 240, 245, null],
    lawngreen: [124, 252, 0, null],
    lemonchiffon: [255, 250, 205, null],
    lightblue: [173, 216, 230, null],
    lightcoral: [240, 128, 128, null],
    lightcyan: [224, 255, 255, null],
    lightgoldenrodyellow: [250, 250, 210, null],
    lightgray: [211, 211, 211, null],
    lightgreen: [144, 238, 144, null],
    lightgrey: [211, 211, 211, null],
    lightpink: [255, 182, 193, null],
    lightsalmon: [255, 160, 122, null],
    lightseagreen: [32, 178, 170, null],
    lightskyblue: [135, 206, 250, null],
    lightslategray: [119, 136, 153, null],
    lightslategrey: [119, 136, 153, null],
    lightsteelblue: [176, 196, 222, null],
    lightyellow: [255, 255, 224, null],
    lime: [0, 255, 0, null],
    limegreen: [50, 205, 50, null],
    linen: [250, 240, 230, null],
    magenta: [255, 0, 255, null],
    maroon: [128, 0, 0, null],
    mediumaquamarine: [102, 205, 170, null],
    mediumblue: [0, 0, 205, null],
    mediumorchid: [186, 85, 211, null],
    mediumpurple: [147, 112, 219, null],
    mediumseagreen: [60, 179, 113, null],
    mediumslateblue: [123, 104, 238, null],
    mediumspringgreen: [0, 250, 154, null],
    mediumturquoise: [72, 209, 204, null],
    mediumvioletred: [199, 21, 133, null],
    midnightblue: [25, 25, 112, null],
    mintcream: [245, 255, 250, null],
    mistyrose: [255, 228, 225, null],
    moccasin: [255, 228, 181, null],
    navajowhite: [255, 222, 173, null],
    navy: [0, 0, 128, null],
    oldlace: [253, 245, 230, null],
    olive: [128, 128, 0, null],
    olivedrab: [107, 142, 35, null],
    orange: [255, 165, 0, null],
    orangered: [255, 69, 0, null],
    orchid: [218, 112, 214, null],
    palegoldenrod: [238, 232, 170, null],
    palegreen: [152, 251, 152, null],
    paleturquoise: [175, 238, 238, null],
    palevioletred: [219, 112, 147, null],
    papayawhip: [255, 239, 213, null],
    peachpuff: [255, 218, 185, null],
    peru: [205, 133, 63, null],
    pink: [255, 192, 203, null],
    plum: [221, 160, 221, null],
    powderblue: [176, 224, 230, null],
    purple: [128, 0, 128, null],
    rebeccapurple: [102, 51, 153, null],
    red: [255, 0, 0, null],
    rosybrown: [188, 143, 143, null],
    royalblue: [65, 105, 225, null],
    saddlebrown: [139, 69, 19, null],
    salmon: [250, 128, 114, null],
    sandybrown: [244, 164, 96, null],
    seagreen: [46, 139, 87, null],
    seashell: [255, 245, 238, null],
    sienna: [160, 82, 45, null],
    silver: [192, 192, 192, null],
    skyblue: [135, 206, 235, null],
    slateblue: [106, 90, 205, null],
    slategray: [112, 128, 144, null],
    slategrey: [112, 128, 144, null],
    snow: [255, 250, 250, null],
    springgreen: [0, 255, 127, null],
    steelblue: [70, 130, 180, null],
    tan: [210, 180, 140, null],
    teal: [0, 128, 128, null],
    thistle: [216, 191, 216, null],
    tomato: [255, 99, 71, null],
    turquoise: [64, 224, 208, null],
    violet: [238, 130, 238, null],
    wheat: [245, 222, 179, null],
    white: [255, 255, 255, null],
    whitesmoke: [245, 245, 245, null],
    yellow: [255, 255, 0, null],
    yellowgreen: [154, 205, 50, null]
};

export const TRANSPARENT = new Color([0, 0, 0, 0]);
