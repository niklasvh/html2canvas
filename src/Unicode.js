/* @flow */
'use strict';

export const fromCodePoint = (...codePoints: Array<number>): string => {
    if (String.fromCodePoint) {
        return String.fromCodePoint(...codePoints);
    }

    const length = codePoints.length;
    if (!length) {
        return '';
    }

    const codeUnits = [];

    let index = -1;
    let result = '';
    while (++index < length) {
        let codePoint = codePoints[index];
        if (codePoint <= 0xffff) {
            codeUnits.push(codePoint);
        } else {
            codePoint -= 0x10000;
            codeUnits.push((codePoint >> 10) + 0xd800, codePoint % 0x400 + 0xdc00);
        }
        if (index + 1 === length || codeUnits.length > 0x4000) {
            result += String.fromCharCode(...codeUnits);
            codeUnits.length = 0;
        }
    }
    return result;
};
