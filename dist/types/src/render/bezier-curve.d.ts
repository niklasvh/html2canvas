import { Vector } from './vector';
import { IPath, PathType, Path } from './path';
export declare class BezierCurve implements IPath {
    type: PathType;
    start: Vector;
    startControl: Vector;
    endControl: Vector;
    end: Vector;
    constructor(start: Vector, startControl: Vector, endControl: Vector, end: Vector);
    subdivide(t: number, firstHalf: boolean): BezierCurve;
    add(deltaX: number, deltaY: number): BezierCurve;
    reverse(): BezierCurve;
}
export declare const isBezierCurve: (path: Path) => path is BezierCurve;
