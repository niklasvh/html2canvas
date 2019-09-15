import {Path} from './path';
import {BoundCurves} from './bound-curves';
import {isBezierCurve} from './bezier-curve';
import {Vector} from './vector';

export const parsePathForBorder = (curves: BoundCurves, borderSide: number): Path[] => {
    switch (borderSide) {
        case 0:
            return createPathFromCurves(
                curves.topLeftBorderBox,
                curves.topLeftPaddingBox,
                curves.topRightBorderBox,
                curves.topRightPaddingBox
            );
        case 1:
            return createPathFromCurves(
                curves.topRightBorderBox,
                curves.topRightPaddingBox,
                curves.bottomRightBorderBox,
                curves.bottomRightPaddingBox
            );
        case 2:
            return createPathFromCurves(
                curves.bottomRightBorderBox,
                curves.bottomRightPaddingBox,
                curves.bottomLeftBorderBox,
                curves.bottomLeftPaddingBox
            );
        case 3:
        default:
            return createPathFromCurves(
                curves.bottomLeftBorderBox,
                curves.bottomLeftPaddingBox,
                curves.topLeftBorderBox,
                curves.topLeftPaddingBox
            );
    }
};

export const parseWidthForDottedBorder = (paths: any[], borderSide: number): any => {
    const topLeft: Vector = isBezierCurve(paths[0]) ? paths[0].start : paths[0];
    const topRight: Vector = isBezierCurve(paths[1]) ? paths[1].start : paths[1];
    const bottomRight: Vector = isBezierCurve(paths[2]) ? paths[2].start : paths[2];
    const bottomLeft: Vector = isBezierCurve(paths[3]) ? paths[3].start : paths[3];
    switch (borderSide) {
        case 0:
            return {
                width: topRight['x'] - topLeft['x'],
                space: bottomRight['y'] - topRight['y']
            }
        case 1:
            return {
                width: topRight['y'] - bottomLeft['y'],
                space: topRight['x'] - bottomRight['x']
            }
        case 2:
            return {
                width: topLeft['x'] - topRight['x'],
                space: topRight['y'] - bottomRight['y']
            }
        case 3:
            return {
                width: topLeft['y'] - bottomRight['y'],
                space: topLeft['y'] - bottomLeft['y']
            }
    }
    return 1

}
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
