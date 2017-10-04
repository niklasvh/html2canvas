/* @flow */
'use strict';

import type Vector from './Vector';
import type BezierCurve from './BezierCurve';
import type Circle from './Circle';

export const PATH = {
    VECTOR: 0,
    BEZIER_CURVE: 1,
    CIRCLE: 2
};

export type PathType = $Values<typeof PATH>;

export interface Drawable<A> {
    type: A
}

export type Path = Array<Vector | BezierCurve> | Circle;
