/* @flow */
'use strict';

import Color from '../Color';

export type TextShadow = {
    color: Color,
    offsetX: number,
    offsetY: number,
    blur: number
};

const TEXT_SHADOW_PROPERTY = /((rgba|rgb)\([^\)]+\)(\s-?\d+px){3})/g;
const TEXT_SHADOW_VALUES = /(-?\d+px)|(#.+)|(rgb\(.+\))|(rgba\(.+\))/g;

export const parseTextShadow = (textShadow: string): Array<TextShadow> | null => {
    if (textShadow === 'none') {
        return null;
    }

    const shadows = textShadow.match(TEXT_SHADOW_PROPERTY);

    if (!shadows) {
        return null;
    }

    const shadowList = [];

    for (let i = 0; i < shadows.length; i++) {
        const shadow = shadows[i].match(TEXT_SHADOW_VALUES);
        if (shadow) {
            shadowList.push({
                color: new Color(shadow[0]),
                offsetX: shadow[1] ? parseFloat(shadow[1].replace('px', '')) : 0,
                offsetY: shadow[2] ? parseFloat(shadow[2].replace('px', '')) : 0,
                blur: shadow[3] ? parseFloat(shadow[3].replace('px', '')) : 0
            });
        }
    }

    return shadowList;
};
