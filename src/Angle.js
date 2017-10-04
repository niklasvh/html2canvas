/* @flow */
'use strict';

const ANGLE = /([+-]?\d*\.?\d+)(deg|grad|rad|turn)/i;

export const parseAngle = (angle: string): number | null => {
    const match = angle.match(ANGLE);

    if (match) {
        const value = parseFloat(match[1]);
        switch (match[2].toLowerCase()) {
            case 'deg':
                return Math.PI * value / 180;
            case 'grad':
                return Math.PI / 200 * value;
            case 'rad':
                return value;
            case 'turn':
                return Math.PI * 2 * value;
        }
    }

    return null;
};
