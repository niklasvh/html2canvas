/* @flow */
'use strict';
import Length from '../Length';

const SIDES = ['top', 'right', 'bottom', 'left'];

export type Margin = Array<Length>;

export const parseMargin = (style: CSSStyleDeclaration): Margin => {
    return SIDES.map(side => new Length(style.getPropertyValue(`margin-${side}`)));
};
