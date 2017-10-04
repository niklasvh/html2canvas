/* @flow */
'use strict';

import Color from '../Color';

export type TextShadow = {
    color: Color,
    offsetX: number,
    offsetY: number,
    blur: number
};

const NUMBER = /^([+-]|\d|\.)$/i;

export const parseTextShadow = (textShadow: ?string): Array<TextShadow> | null => {
    if (textShadow === 'none' || typeof textShadow !== 'string') {
        return null;
    }

    let currentValue = '';
    let isLength = false;
    const values = [];
    const shadows = [];
    let numParens = 0;
    let color = null;

    const appendValue = () => {
        if (currentValue.length) {
            if (isLength) {
                values.push(parseFloat(currentValue));
            } else {
                color = new Color(currentValue);
            }
        }
        isLength = false;
        currentValue = '';
    };

    const appendShadow = () => {
        if (values.length && color !== null) {
            shadows.push({
                color,
                offsetX: values[0] || 0,
                offsetY: values[1] || 0,
                blur: values[2] || 0
            });
        }
        values.splice(0, values.length);
        color = null;
    };

    for (let i = 0; i < textShadow.length; i++) {
        const c = textShadow[i];
        switch (c) {
            case '(':
                currentValue += c;
                numParens++;
                break;
            case ')':
                currentValue += c;
                numParens--;
                break;
            case ',':
                if (numParens === 0) {
                    appendValue();
                    appendShadow();
                } else {
                    currentValue += c;
                }
                break;
            case ' ':
                if (numParens === 0) {
                    appendValue();
                } else {
                    currentValue += c;
                }
                break;
            default:
                if (currentValue.length === 0 && NUMBER.test(c)) {
                    isLength = true;
                }
                currentValue += c;
        }
    }

    appendValue();
    appendShadow();

    if (shadows.length === 0) {
        return null;
    }

    return shadows;
};
