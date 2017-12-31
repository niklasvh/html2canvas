/* @flow */
'use strict';

export const LINE_BREAK = {
    NORMAL: 'normal',
    STRICT: 'strict'
};

export type LineBreak = $Values<typeof LINE_BREAK>;

export const parseLineBreak = (wordBreak: string): LineBreak => {
    switch (wordBreak) {
        case 'strict':
            return LINE_BREAK.STRICT;
        case 'normal':
        default:
            return LINE_BREAK.NORMAL;
    }
};
