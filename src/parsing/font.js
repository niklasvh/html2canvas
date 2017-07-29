/* @flow */
'use strict';

export type Font = {
    fontFamily: string,
    fontSize: string,
    fontStyle: string,
    fontVariant: string,
    fontWeight: number
};

const parseFontWeight = (weight: string): number => {
    switch (weight) {
        case 'normal':
            return 400;
        case 'bold':
            return 700;
    }

    const value = parseInt(weight, 10);
    return isNaN(value) ? 400 : value;
};

export const parseFont = (style: CSSStyleDeclaration): Font => {
    const fontFamily = style.fontFamily;
    const fontSize = style.fontSize;
    const fontStyle = style.fontStyle;
    const fontVariant = style.fontVariant;
    const fontWeight = parseFontWeight(style.fontWeight);

    return {
        fontFamily,
        fontSize,
        fontStyle,
        fontVariant,
        fontWeight
    };
};
