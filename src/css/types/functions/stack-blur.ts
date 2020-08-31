/* eslint-disable no-bitwise -- used for calculations */
/* eslint-disable unicorn/prefer-query-selector -- aiming at
  backward-compatibility */
/**
 * StackBlur - a fast almost Gaussian Blur For Canvas
 *
 * In case you find this class useful - especially in commercial projects -
 * I am not totally unhappy for a small donation to my PayPal account
 * mario@quasimondo.de
 *
 * Or support me on flattr:
 * {@link https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript}.
 *
 * @module StackBlur
 * @author Mario Klingemann
 * Contact: mario@quasimondo.com
 * Website: {@link http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html}
 * Twitter: @quasimondo
 *
 * @copyright (c) 2010 Mario Klingemann
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

const mulTable = [
    512,
    512,
    456,
    512,
    328,
    456,
    335,
    512,
    405,
    328,
    271,
    456,
    388,
    335,
    292,
    512,
    454,
    405,
    364,
    328,
    298,
    271,
    496,
    456,
    420,
    388,
    360,
    335,
    312,
    292,
    273,
    512,
    482,
    454,
    428,
    405,
    383,
    364,
    345,
    328,
    312,
    298,
    284,
    271,
    259,
    496,
    475,
    456,
    437,
    420,
    404,
    388,
    374,
    360,
    347,
    335,
    323,
    312,
    302,
    292,
    282,
    273,
    265,
    512,
    497,
    482,
    468,
    454,
    441,
    428,
    417,
    405,
    394,
    383,
    373,
    364,
    354,
    345,
    337,
    328,
    320,
    312,
    305,
    298,
    291,
    284,
    278,
    271,
    265,
    259,
    507,
    496,
    485,
    475,
    465,
    456,
    446,
    437,
    428,
    420,
    412,
    404,
    396,
    388,
    381,
    374,
    367,
    360,
    354,
    347,
    341,
    335,
    329,
    323,
    318,
    312,
    307,
    302,
    297,
    292,
    287,
    282,
    278,
    273,
    269,
    265,
    261,
    512,
    505,
    497,
    489,
    482,
    475,
    468,
    461,
    454,
    447,
    441,
    435,
    428,
    422,
    417,
    411,
    405,
    399,
    394,
    389,
    383,
    378,
    373,
    368,
    364,
    359,
    354,
    350,
    345,
    341,
    337,
    332,
    328,
    324,
    320,
    316,
    312,
    309,
    305,
    301,
    298,
    294,
    291,
    287,
    284,
    281,
    278,
    274,
    271,
    268,
    265,
    262,
    259,
    257,
    507,
    501,
    496,
    491,
    485,
    480,
    475,
    470,
    465,
    460,
    456,
    451,
    446,
    442,
    437,
    433,
    428,
    424,
    420,
    416,
    412,
    408,
    404,
    400,
    396,
    392,
    388,
    385,
    381,
    377,
    374,
    370,
    367,
    363,
    360,
    357,
    354,
    350,
    347,
    344,
    341,
    338,
    335,
    332,
    329,
    326,
    323,
    320,
    318,
    315,
    312,
    310,
    307,
    304,
    302,
    299,
    297,
    294,
    292,
    289,
    287,
    285,
    282,
    280,
    278,
    275,
    273,
    271,
    269,
    267,
    265,
    263,
    261,
    259
];

const shgTable = [
    9,
    11,
    12,
    13,
    13,
    14,
    14,
    15,
    15,
    15,
    15,
    16,
    16,
    16,
    16,
    17,
    17,
    17,
    17,
    17,
    17,
    17,
    18,
    18,
    18,
    18,
    18,
    18,
    18,
    18,
    18,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24
];

/**
 * @param {ImageData} imageData
 * @param {Integer} width
 * @param {Integer} height
 * @param {Float} radius
 * @returns {ImageData}
 */
function processImageDataRGBA(imageData: ImageData, width: number, height: number, radius: number) {
    const pixels = imageData.data;

    const div = 2 * radius + 1;
    // const w4 = width << 2;
    const widthMinus1 = width - 1;
    const heightMinus1 = height - 1;
    const radiusPlus1 = radius + 1;
    const sumFactor = (radiusPlus1 * (radiusPlus1 + 1)) / 2;

    const stackStart: BlurStack = new BlurStack();
    let stack = stackStart;
    let stackEnd;
    for (let i = 1; i < div; i++) {
        stack = stack.next = new BlurStack();
        if (i === radiusPlus1) {
            stackEnd = stack;
        }
    }
    stack.next = stackStart;

    let stackIn: BlurStack,
        stackOut = null,
        yw = 0,
        yi = 0;

    const mulSum = mulTable[radius];
    const shgSum = shgTable[radius];

    for (let y = 0; y < height; y++) {
        stack = stackStart;

        const pr = pixels[yi],
            pg = pixels[yi + 1],
            pb = pixels[yi + 2],
            pa = pixels[yi + 3];

        for (let i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack.a = pa;
            if (stack.next) stack = stack.next;
        }

        let rInSum = 0,
            gInSum = 0,
            bInSum = 0,
            aInSum = 0,
            rOutSum = radiusPlus1 * pr,
            gOutSum = radiusPlus1 * pg,
            bOutSum = radiusPlus1 * pb,
            aOutSum = radiusPlus1 * pa,
            rSum = sumFactor * pr,
            gSum = sumFactor * pg,
            bSum = sumFactor * pb,
            aSum = sumFactor * pa;

        for (let i = 1; i < radiusPlus1; i++) {
            const p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);

            const r = pixels[p],
                g = pixels[p + 1],
                b = pixels[p + 2],
                a = pixels[p + 3];

            const rbs = radiusPlus1 - i;
            rSum += (stack.r = r) * rbs;
            gSum += (stack.g = g) * rbs;
            bSum += (stack.b = b) * rbs;
            aSum += (stack.a = a) * rbs;

            rInSum += r;
            gInSum += g;
            bInSum += b;
            aInSum += a;

            if (stack.next) stack = stack.next;
        }

        stackIn = stackStart;
        stackOut = stackEnd;
        for (let x = 0; x < width; x++) {
            const paInitial = (aSum * mulSum) >> shgSum;
            pixels[yi + 3] = paInitial;
            if (paInitial !== 0) {
                const a = 255 / paInitial;
                pixels[yi] = ((rSum * mulSum) >> shgSum) * a;
                pixels[yi + 1] = ((gSum * mulSum) >> shgSum) * a;
                pixels[yi + 2] = ((bSum * mulSum) >> shgSum) * a;
            } else {
                pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
            }

            rSum -= rOutSum;
            gSum -= gOutSum;
            bSum -= bOutSum;
            aSum -= aOutSum;

            rOutSum -= stackIn.r;
            gOutSum -= stackIn.g;
            bOutSum -= stackIn.b;
            aOutSum -= stackIn.a;

            let p = x + radius + 1;
            p = (yw + (p < widthMinus1 ? p : widthMinus1)) << 2;

            rInSum += stackIn.r = pixels[p];
            gInSum += stackIn.g = pixels[p + 1];
            bInSum += stackIn.b = pixels[p + 2];
            aInSum += stackIn.a = pixels[p + 3];

            rSum += rInSum;
            gSum += gInSum;
            bSum += bInSum;
            aSum += aInSum;

            if (stackIn.next) stackIn = stackIn.next;

            if (stackOut) {
                const {r, g, b, a} = stackOut;

                rOutSum += r;
                gOutSum += g;
                bOutSum += b;
                aOutSum += a;

                rInSum -= r;
                gInSum -= g;
                bInSum -= b;
                aInSum -= a;

                stackOut = stackOut.next;
            }

            yi += 4;
        }
        yw += width;
    }

    for (let x = 0; x < width; x++) {
        yi = x << 2;

        let pr = pixels[yi],
            pg = pixels[yi + 1],
            pb = pixels[yi + 2],
            pa = pixels[yi + 3],
            rOutSum = radiusPlus1 * pr,
            gOutSum = radiusPlus1 * pg,
            bOutSum = radiusPlus1 * pb,
            aOutSum = radiusPlus1 * pa,
            rSum = sumFactor * pr,
            gSum = sumFactor * pg,
            bSum = sumFactor * pb,
            aSum = sumFactor * pa;

        stack = stackStart;

        for (let i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack.a = pa;
            if (stack.next) stack = stack.next;
        }

        let yp = width;

        let gInSum = 0,
            bInSum = 0,
            aInSum = 0,
            rInSum = 0;
        for (let i = 1; i <= radius; i++) {
            yi = (yp + x) << 2;

            const rbs = radiusPlus1 - i;
            rSum += (stack.r = pr = pixels[yi]) * rbs;
            gSum += (stack.g = pg = pixels[yi + 1]) * rbs;
            bSum += (stack.b = pb = pixels[yi + 2]) * rbs;
            aSum += (stack.a = pa = pixels[yi + 3]) * rbs;

            rInSum += pr;
            gInSum += pg;
            bInSum += pb;
            aInSum += pa;

            if (stack.next) stack = stack.next;

            if (i < heightMinus1) {
                yp += width;
            }
        }

        yi = x;
        stackIn = stackStart;
        stackOut = stackEnd;
        for (let y = 0; y < height; y++) {
            let p = yi << 2;
            pixels[p + 3] = pa = (aSum * mulSum) >> shgSum;
            if (pa > 0) {
                pa = 255 / pa;
                pixels[p] = ((rSum * mulSum) >> shgSum) * pa;
                pixels[p + 1] = ((gSum * mulSum) >> shgSum) * pa;
                pixels[p + 2] = ((bSum * mulSum) >> shgSum) * pa;
            } else {
                pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
            }

            rSum -= rOutSum;
            gSum -= gOutSum;
            bSum -= bOutSum;
            aSum -= aOutSum;

            rOutSum -= stackIn.r;
            gOutSum -= stackIn.g;
            bOutSum -= stackIn.b;
            aOutSum -= stackIn.a;

            p = (x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width) << 2;

            rSum += rInSum += stackIn.r = pixels[p];
            gSum += gInSum += stackIn.g = pixels[p + 1];
            bSum += bInSum += stackIn.b = pixels[p + 2];
            aSum += aInSum += stackIn.a = pixels[p + 3];

            if (stackIn.next) stackIn = stackIn.next;

            if (stackOut) {
                rOutSum += pr = stackOut.r;
                gOutSum += pg = stackOut.g;
                bOutSum += pb = stackOut.b;
                aOutSum += pa = stackOut.a;

                rInSum -= pr;
                gInSum -= pg;
                bInSum -= pb;
                aInSum -= pa;

                stackOut = stackOut.next;
            }

            yi += width;
        }
    }
    return imageData;
}

/**
 * @param {ImageData} imageData
 * @param {Integer} topX
 * @param {Integer} topY
 * @param {Integer} width
 * @param {Integer} height
 * @param {Float} radius
 * @returns {ImageData}
 */
function processImageDataRGB(imageData: ImageData, width: number, height: number, radius: number) {
    const pixels = imageData.data;

    const div = 2 * radius + 1;
    // const w4 = width << 2;
    const widthMinus1 = width - 1;
    const heightMinus1 = height - 1;
    const radiusPlus1 = radius + 1;
    const sumFactor = (radiusPlus1 * (radiusPlus1 + 1)) / 2;

    const stackStart = new BlurStack();
    let stack = stackStart;
    let stackEnd;
    for (let i = 1; i < div; i++) {
        stack = stack.next = new BlurStack();
        if (i === radiusPlus1) {
            stackEnd = stack;
        }
    }
    stack.next = stackStart;
    let stackIn = null;
    let stackOut = null;

    const mulSum = mulTable[radius];
    const shgSum = shgTable[radius];

    let p, rbs;
    let yw = 0,
        yi = 0;

    for (let y = 0; y < height; y++) {
        let pr = pixels[yi],
            pg = pixels[yi + 1],
            pb = pixels[yi + 2],
            rOutSum = radiusPlus1 * pr,
            gOutSum = radiusPlus1 * pg,
            bOutSum = radiusPlus1 * pb,
            rSum = sumFactor * pr,
            gSum = sumFactor * pg,
            bSum = sumFactor * pb;

        stack = stackStart;

        for (let i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            if (stack.next) stack = stack.next;
        }

        let rInSum = 0,
            gInSum = 0,
            bInSum = 0;
        for (let i = 1; i < radiusPlus1; i++) {
            p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
            rSum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
            gSum += (stack.g = pg = pixels[p + 1]) * rbs;
            bSum += (stack.b = pb = pixels[p + 2]) * rbs;

            rInSum += pr;
            gInSum += pg;
            bInSum += pb;

            if (stack.next) stack = stack.next;
        }

        stackIn = stackStart;
        stackOut = stackEnd;
        for (let x = 0; x < width; x++) {
            pixels[yi] = (rSum * mulSum) >> shgSum;
            pixels[yi + 1] = (gSum * mulSum) >> shgSum;
            pixels[yi + 2] = (bSum * mulSum) >> shgSum;

            rSum -= rOutSum;
            gSum -= gOutSum;
            bSum -= bOutSum;

            if (stackIn && stackOut) {
                rOutSum -= stackIn.r;
                gOutSum -= stackIn.g;
                bOutSum -= stackIn.b;

                p = (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;

                rInSum += stackIn.r = pixels[p];
                gInSum += stackIn.g = pixels[p + 1];
                bInSum += stackIn.b = pixels[p + 2];

                rSum += rInSum;
                gSum += gInSum;
                bSum += bInSum;

                stackIn = stackIn.next;

                rOutSum += pr = stackOut.r;
                gOutSum += pg = stackOut.g;
                bOutSum += pb = stackOut.b;

                rInSum -= pr;
                gInSum -= pg;
                bInSum -= pb;

                stackOut = stackOut.next;
            }

            yi += 4;
        }
        yw += width;
    }

    for (let x = 0; x < width; x++) {
        yi = x << 2;
        let pr = pixels[yi],
            pg = pixels[yi + 1],
            pb = pixels[yi + 2],
            rOutSum = radiusPlus1 * pr,
            gOutSum = radiusPlus1 * pg,
            bOutSum = radiusPlus1 * pb,
            rSum = sumFactor * pr,
            gSum = sumFactor * pg,
            bSum = sumFactor * pb;

        stack = stackStart;

        for (let i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            if (stack.next) stack = stack.next;
        }

        let rInSum = 0,
            gInSum = 0,
            bInSum = 0;
        for (let i = 1, yp = width; i <= radius; i++) {
            yi = (yp + x) << 2;

            rSum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
            gSum += (stack.g = pg = pixels[yi + 1]) * rbs;
            bSum += (stack.b = pb = pixels[yi + 2]) * rbs;

            rInSum += pr;
            gInSum += pg;
            bInSum += pb;

            if (stack.next) stack = stack.next;

            if (i < heightMinus1) {
                yp += width;
            }
        }

        yi = x;
        stackIn = stackStart;
        stackOut = stackEnd;
        for (let y = 0; y < height; y++) {
            p = yi << 2;
            pixels[p] = (rSum * mulSum) >> shgSum;
            pixels[p + 1] = (gSum * mulSum) >> shgSum;
            pixels[p + 2] = (bSum * mulSum) >> shgSum;

            rSum -= rOutSum;
            gSum -= gOutSum;
            bSum -= bOutSum;

            if (stackIn && stackOut) {
                rOutSum -= stackIn.r;
                gOutSum -= stackIn.g;
                bOutSum -= stackIn.b;

                p = (x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width) << 2;

                rSum += rInSum += stackIn.r = pixels[p];
                gSum += gInSum += stackIn.g = pixels[p + 1];
                bSum += bInSum += stackIn.b = pixels[p + 2];

                stackIn = stackIn.next;

                rOutSum += pr = stackOut.r;
                gOutSum += pg = stackOut.g;
                bOutSum += pb = stackOut.b;

                rInSum -= pr;
                gInSum -= pg;
                bInSum -= pb;

                stackOut = stackOut.next;
            }

            yi += width;
        }
    }

    return imageData;
}

/**
 *
 */
export class BlurStack {
    /**
     * Set properties.
     */
    r: number;
    g: number;
    b: number;
    a: number;
    next?: BlurStack;

    constructor() {
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 0;
    }
}

export const stackBlurImage = (
    imageData: ImageData,
    width: number,
    height: number,
    radius: number,
    blurAlphaChannel: number
): ImageData => {
    if (isNaN(radius) || radius < 1) {
        return imageData;
    }
    radius |= 0;

    if (blurAlphaChannel) {
        return processImageDataRGBA(imageData, width, height, radius);
    } else {
        return processImageDataRGB(imageData, width, height, radius);
    }
};
