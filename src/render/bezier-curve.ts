import {Vector} from './vector';
import {IPath, PathType, Path} from './path';

const lerp = (a: Vector, b: Vector, t: number): Vector => {
    return new Vector(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
};

export class BezierCurve implements IPath {
    type: PathType;
    start: Vector;
    startControl: Vector;
    endControl: Vector;
    end: Vector;

    constructor(start: Vector, startControl: Vector, endControl: Vector, end: Vector) {
        this.type = PathType.BEZIER_CURVE;
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
        return firstHalf ? new BezierCurve(this.start, ab, abbc, dest) : new BezierCurve(dest, bccd, cd, this.end);
    }

    add(deltaX: number, deltaY: number): BezierCurve {
        return new BezierCurve(
            this.start.add(deltaX, deltaY),
            this.startControl.add(deltaX, deltaY),
            this.endControl.add(deltaX, deltaY),
            this.end.add(deltaX, deltaY)
        );
    }

    reverse(): BezierCurve {
        return new BezierCurve(this.end, this.endControl, this.startControl, this.start);
    }
}

export const isBezierCurve = (path: Path): path is BezierCurve => path.type === PathType.BEZIER_CURVE;
