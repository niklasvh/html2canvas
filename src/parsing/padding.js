/* @flow */
'use strict';
import Length from '../Length';

export const PADDING_SIDES = {
    TOP: 0,
    RIGHT: 1,
    BOTTOM: 2,
    LEFT: 3
};

const SIDES = ['top', 'right', 'bottom', 'left'];

export type Padding = Array<Length>;

export const parsePadding = (style: CSSStyleDeclaration): Padding => {
    return SIDES.map(side => new Length(style.getPropertyValue(`padding-${side}`)));
};
