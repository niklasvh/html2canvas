/* @flow */
'use strict';

export const FLEX_WRAP = {
    NOWRAP: 0,
    WRAP: 1,
    WRAP_REVERSE: 2
};

export type FlexWrap = $Values<typeof FLEX_WRAP>;

export const parseFlexWrap = (flexWrap: string): FlexWrap => {
    switch (flexWrap) {
        case 'nowrap':
            return FLEX_WRAP.NOWRAP;
        case 'wrap':
            return FLEX_WRAP.WRAP;
        case 'wrap-reverse':
            return FLEX_WRAP.WRAP_REVERSE;
        default:
            return FLEX_WRAP.NOWRAP;
    }
};
