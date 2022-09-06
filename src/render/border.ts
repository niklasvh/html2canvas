import {Path} from './path';
import {BoundCurves} from './bound-curves';
import {isBezierCurve} from './bezier-curve';

export enum BORDER_SIDE {
    TOP = 0,
    RIGHT = 1,
    BOTTOM = 2,
    LEFT = 3
}
export const parsePathForBorder = (curves: BoundCurves, borderSide: BORDER_SIDE): Path[] => {
    switch (borderSide) {
        case BORDER_SIDE.TOP:
            return createPathFromCurves(
                curves.topLeftBorderBox,
                curves.topLeftPaddingBox,
                curves.topRightBorderBox,
                curves.topRightPaddingBox
            );
        case BORDER_SIDE.RIGHT:
            return createPathFromCurves(
                curves.topRightBorderBox,
                curves.topRightPaddingBox,
                curves.bottomRightBorderBox,
                curves.bottomRightPaddingBox
            );
        case BORDER_SIDE.BOTTOM:
            return createPathFromCurves(
                curves.bottomRightBorderBox,
                curves.bottomRightPaddingBox,
                curves.bottomLeftBorderBox,
                curves.bottomLeftPaddingBox
            );
        case BORDER_SIDE.LEFT:
        default:
            return createPathFromCurves(
                curves.bottomLeftBorderBox,
                curves.bottomLeftPaddingBox,
                curves.topLeftBorderBox,
                curves.topLeftPaddingBox
            );
    }
};

export const parsePathForBorderDoubleOuter = (curves: BoundCurves, borderSide: BORDER_SIDE): Path[] => {
    switch (borderSide) {
        case BORDER_SIDE.TOP:
            return createPathFromCurves(
                curves.topLeftBorderBox,
                curves.topLeftBorderDoubleOuterBox,
                curves.topRightBorderBox,
                curves.topRightBorderDoubleOuterBox
            );
        case BORDER_SIDE.RIGHT:
            return createPathFromCurves(
                curves.topRightBorderBox,
                curves.topRightBorderDoubleOuterBox,
                curves.bottomRightBorderBox,
                curves.bottomRightBorderDoubleOuterBox
            );
        case BORDER_SIDE.BOTTOM:
            return createPathFromCurves(
                curves.bottomRightBorderBox,
                curves.bottomRightBorderDoubleOuterBox,
                curves.bottomLeftBorderBox,
                curves.bottomLeftBorderDoubleOuterBox
            );
        case BORDER_SIDE.LEFT:
        default:
            return createPathFromCurves(
                curves.bottomLeftBorderBox,
                curves.bottomLeftBorderDoubleOuterBox,
                curves.topLeftBorderBox,
                curves.topLeftBorderDoubleOuterBox
            );
    }
};

export const parsePathForBorderDoubleInner = (curves: BoundCurves, borderSide: BORDER_SIDE): Path[] => {
    switch (borderSide) {
        case BORDER_SIDE.TOP:
            return createPathFromCurves(
                curves.topLeftBorderDoubleInnerBox,
                curves.topLeftPaddingBox,
                curves.topRightBorderDoubleInnerBox,
                curves.topRightPaddingBox
            );
        case BORDER_SIDE.RIGHT:
            return createPathFromCurves(
                curves.topRightBorderDoubleInnerBox,
                curves.topRightPaddingBox,
                curves.bottomRightBorderDoubleInnerBox,
                curves.bottomRightPaddingBox
            );
        case BORDER_SIDE.BOTTOM:
            return createPathFromCurves(
                curves.bottomRightBorderDoubleInnerBox,
                curves.bottomRightPaddingBox,
                curves.bottomLeftBorderDoubleInnerBox,
                curves.bottomLeftPaddingBox
            );
        case BORDER_SIDE.LEFT:
        default:
            return createPathFromCurves(
                curves.bottomLeftBorderDoubleInnerBox,
                curves.bottomLeftPaddingBox,
                curves.topLeftBorderDoubleInnerBox,
                curves.topLeftPaddingBox
            );
    }
};

export const parsePathForBorderStroke = (curves: BoundCurves, borderSide: BORDER_SIDE): Path[] => {
    switch (borderSide) {
        case BORDER_SIDE.TOP:
            return createStrokePathFromCurves(curves.topLeftBorderStroke, curves.topRightBorderStroke);
        case BORDER_SIDE.RIGHT:
            return createStrokePathFromCurves(curves.topRightBorderStroke, curves.bottomRightBorderStroke);
        case BORDER_SIDE.BOTTOM:
            return createStrokePathFromCurves(curves.bottomRightBorderStroke, curves.bottomLeftBorderStroke);
        case BORDER_SIDE.LEFT:
        default:
            return createStrokePathFromCurves(curves.bottomLeftBorderStroke, curves.topLeftBorderStroke);
    }
};

const createStrokePathFromCurves = (outer1: Path, outer2: Path): Path[] => {
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

    return path;
};

const createPathFromCurves = (outer1: Path, inner1: Path, outer2: Path, inner2: Path): Path[] => {
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
