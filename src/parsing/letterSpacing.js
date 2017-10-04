/* @flow */
'use strict';

export const parseLetterSpacing = (letterSpacing: string): number => {
    if (letterSpacing === 'normal') {
        return 0;
    }
    const value = parseInt(letterSpacing, 10);
    return isNaN(value) ? 0 : value;
};
