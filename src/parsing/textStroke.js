/* @flow */
'use strict';

import Color from '../Color';

export type TextStroke = {
    color: Color,
    size: string,
};
export const parseTextStroke = (textStrokeWidth: string, textStrokeColor: string): TextStroke => {
    const color = new Color(textStrokeColor);
    const size = parseInt(textStrokeWidth);

    return {
        color,
        size
    };
};
