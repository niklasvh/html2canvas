import {BezierCurve} from "./bezier-curve";
import {Vector} from "./vector";
export enum PathType {
    VECTOR = 0,
    BEZIER_CURVE = 1
}

export interface IPath {
    type: PathType
}

export const equalPath = (a: Path[], b: Path[]): boolean => {
    if (a.length === b.length) {
        return a.some((v, i) => v === b[i]);
    }

    return false;
};

export type Path = Vector | BezierCurve;
