/* @flow */
'use strict';

export const OVERFLOW_WRAP = {
    NORMAL: 0,
    BREAK_WORD: 1
};

export type OverflowWrap = $Values<typeof OVERFLOW_WRAP>;

export const parseOverflowWrap = (overflow: string): OverflowWrap => {
    switch (overflow) {
        case 'break-word':
            return OVERFLOW_WRAP.BREAK_WORD;
        case 'normal':
        default:
            return OVERFLOW_WRAP.NORMAL;
    }
};
