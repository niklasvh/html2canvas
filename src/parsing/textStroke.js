/* @flow */
'use strict';

import Color from '../Color';

export type TextStroke = {
    color: Color,
    size: number
};

export const parseTextStroke = (
    textStrokeWidth: string,
    textStrokeColor: string
): TextStroke | null => {
    const color = new Color(textStrokeColor);
    const size = parseFloat(textStrokeWidth);

    if (size <= 0) {
        return null;
    }

    return {
        color,
        size
    };
};
