/* @flow */
'use strict';
import type {Drawable} from './Path';
import {PATH} from './Path';
import Vector from './Vector';

const lerp = (a: Vector, b: Vector, t: number): Vector => {
    return new Vector(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
};

export default class BezierCurve implements Drawable<1> {
    type: 1;
    start: Vector;
    startControl: Vector;
    endControl: Vector;
    end: Vector;

    constructor(start: Vector, startControl: Vector, endControl: Vector, end: Vector) {
        this.type = PATH.BEZIER_CURVE;
        this.start = start;
        this.startControl = startControl;
        this.endControl = endControl;
        this.end = end;
    }

    subdivide(t: number, firstHalf: boolean): BezierCurve {
        const ab = lerp(this.start, this.startControl, t);
        const bc = lerp(this.startControl, this.endControl, t);
        const cd = lerp(this.endControl, this.end, t);
        const abbc = lerp(ab, bc, t);
        const bccd = lerp(bc, cd, t);
        const dest = lerp(abbc, bccd, t);
        return firstHalf
            ? new BezierCurve(this.start, ab, abbc, dest)
            : new BezierCurve(dest, bccd, cd, this.end);
    }

    reverse(): BezierCurve {
        return new BezierCurve(this.end, this.endControl, this.startControl, this.start);
    }
}
