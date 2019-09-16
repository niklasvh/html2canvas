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

export const parseWidthForDashedAndDottedBorder = (paths: any[], borderSide: number): any => {
    const topLeft: Vector = isBezierCurve(paths[0]) ? paths[0].start : paths[0];
    const topRight: Vector = isBezierCurve(paths[1]) ? paths[1].start : paths[1];
    const bottomRight: Vector = isBezierCurve(paths[2]) ? paths[2].start : paths[2];
    const bottomLeft: Vector = isBezierCurve(paths[3]) ? paths[3].start : paths[3];
    switch (borderSide) {
        case 0:
            return {
                width: topRight['x'] - topLeft['x'],
                space: bottomRight['y'] - topRight['y'],
                startPos: topLeft
            };
        case 1:
            return {
                width: topRight['y'] - topLeft['y'],
                space: topRight['x'] - bottomRight['x'],
                startPos: topLeft
            };
        case 2:
            return {
                width: topLeft['x'] - topRight['x'],
                space: topRight['y'] - bottomLeft['y'],
                startPos: topLeft
            };
        case 3:
            return {
                width: topLeft['y'] - topRight['y'],
                space: bottomLeft['x'] - topRight['x'],
                startPos: topLeft
            };
    }
};

export const renderDottedLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    interval: number,
    context: CanvasRenderingContext2D,
    color: string,
    offset: number
) => {
    if (!interval) {
        interval = 5;
    }
    let isHorizontal = true;
    if (x1 == x2) {
        isHorizontal = false;
    }
    const len = isHorizontal ? x2 - x1 : y2 - y1;
    context.moveTo(x1, y1);
    context.fillStyle = color;
    let progress = 0;
    const r = Math.abs(interval) / 2;
    while (Math.abs(len) > Math.abs(progress)) {
        if (isHorizontal) {
            context.beginPath()
            context.moveTo(x1 + progress, y1 + offset);
            context.arc(x1 + progress, y1 + offset, r, 0, Math.PI * 2, true);
            context.fill();
            context.closePath()
        } else {
            context.beginPath()
            context.moveTo(x1 + offset, y1 + progress);
            context.arc(x1 + offset, y1 + progress, r, 0, Math.PI * 2, true);
            context.fill();
            context.closePath()
        }
        progress += interval * 2;
    }
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
