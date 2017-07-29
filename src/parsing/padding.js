/* @flow */
'use strict';
import Length from '../Length';

const SIDES = ['top', 'right', 'bottom', 'left'];

export type Padding = Array<Length>;

export const parsePadding = (style: CSSStyleDeclaration): Padding => {
    return SIDES.map(side => new Length(style.getPropertyValue(`padding-${side}`)));
};
