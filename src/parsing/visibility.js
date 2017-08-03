/* @flow */
'use strict';

export const VISIBILITY = {
    VISIBLE: 0,
    HIDDEN: 1,
    COLLAPSE: 2
};

export type Visibility = $Values<typeof VISIBILITY>;

export const parseVisibility = (visibility: string): Visibility => {
    switch (visibility) {
        case 'hidden':
            return VISIBILITY.HIDDEN;
        case 'collapse':
            return VISIBILITY.COLLAPSE;
        case 'visible':
        default:
            return VISIBILITY.VISIBLE;
    }
};
