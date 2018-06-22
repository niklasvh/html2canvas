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

export const JUSTIFY_CONTENT = {
    FLEX_START: 0,
    FLEX_END: 1,
    CENTER: 2,
    SPACE_BETWEEN: 3,
    SPACE_AROUND: 4
};

export type JustifyContent = $Values<typeof JUSTIFY_CONTENT>;

export const parseJustifyContent = (justifyContent: string): JustifyContent => {
    switch (justifyContent) {
        case 'flex-start':
            return JUSTIFY_CONTENT.FLEX_START;
        case 'flex-end':
            return JUSTIFY_CONTENT.FLEX_END;
        case 'center':
            return JUSTIFY_CONTENT.CENTER;
        case 'space-between':
            return JUSTIFY_CONTENT.SPACE_BETWEEN;
        case 'space-around':
            return JUSTIFY_CONTENT.SPACE_AROUND;
        default:
            return JUSTIFY_CONTENT.FLEX_START;
    }
};
