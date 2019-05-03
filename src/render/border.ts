import {Path} from "./path";
import {BoundCurves} from "./bound-curves";
import {isBezierCurve} from "./bezier-curve";

export const parsePathForBorder = (curves: BoundCurves, borderSide: number): Path[] => {
    switch (borderSide) {
        case 0:
            return createPathFromCurves(
                curves.topLeftOuter,
                curves.topLeftInner,
                curves.topRightOuter,
                curves.topRightInner
            );
        case 1:
            return createPathFromCurves(
                curves.topRightOuter,
                curves.topRightInner,
                curves.bottomRightOuter,
                curves.bottomRightInner
            );
        case 2:
            return createPathFromCurves(
                curves.bottomRightOuter,
                curves.bottomRightInner,
                curves.bottomLeftOuter,
                curves.bottomLeftInner
            );
        case 3:
        default:
            return createPathFromCurves(
                curves.bottomLeftOuter,
                curves.bottomLeftInner,
                curves.topLeftOuter,
                curves.topLeftInner
            );
    }
};

const createPathFromCurves = (
    outer1: Path,
    inner1: Path,
    outer2: Path,
    inner2: Path
): Path[] => {
    const path = [];
    if (isBezierCurve(outer1)) {
        path.push(outer1.subdivide(0.5, false));
    } else {
        path.push(outer1);
    }

    if (isBezierCurve(outer2)) {
        path.push(outer2.subdivide(0.5, true));
    } else {
        path.push(outer2);
    }

    if (isBezierCurve(inner2)) {
        path.push(inner2.subdivide(0.5, true).reverse());
    } else {
        path.push(inner2);
    }

    if (isBezierCurve(inner1)) {
        path.push(inner1.subdivide(0.5, false).reverse());
    } else {
        path.push(inner1);
    }

    return path;
};
