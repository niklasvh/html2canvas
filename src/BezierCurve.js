/* @flow */
'use strict';
import Vector from './Vector';

export default class BezierCurve {
    start: Vector;
    startControl: Vector;
    endControl: Vector;
    end: Vector;

    constructor(start: Vector, startControl: Vector, endControl: Vector, end: Vector) {
        this.start = start;
        this.startControl = startControl;
        this.endControl = endControl;
        this.end = end;
    }

    lerp(a: Vector, b: Vector, t: number): Vector {
        return new Vector(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
    }

    subdivide(t: number): [BezierCurve, BezierCurve] {
        const ab = this.lerp(this.start, this.startControl, t);
        const bc = this.lerp(this.startControl, this.endControl, t);
        const cd = this.lerp(this.endControl, this.end, t);
        const abbc = this.lerp(ab, bc, t);
        const bccd = this.lerp(bc, cd, t);
        const dest = this.lerp(abbc, bccd, t);
        return [
            new BezierCurve(this.start, ab, abbc, dest),
            new BezierCurve(dest, bccd, cd, this.end)
        ];
    }

    reverse(): BezierCurve {
        return new BezierCurve(this.end, this.endControl, this.startControl, this.start);
    }
}
