import { BezierCurve } from './bezier-curve';
import { Vector } from './vector';
export declare enum PathType {
    VECTOR = 0,
    BEZIER_CURVE = 1
}
export interface IPath {
    type: PathType;
    add(deltaX: number, deltaY: number): IPath;
}
export declare const equalPath: (a: Path[], b: Path[]) => boolean;
export declare const transformPath: (path: Path[], deltaX: number, deltaY: number, deltaW: number, deltaH: number) => Path[];
export declare type Path = Vector | BezierCurve;
