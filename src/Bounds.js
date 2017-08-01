/* @flow */
'use strict';

import type {Border, BorderSide} from './parsing/border';
import type {BorderRadius} from './parsing/borderRadius';
import type {Padding} from './parsing/padding';

import Vector from './Vector';
import BezierCurve from './BezierCurve';

export type Path = Array<Vector | BezierCurve>;

const TOP = 0;
const RIGHT = 1;
const BOTTOM = 2;
const LEFT = 3;

export type BoundCurves = {
    topLeftOuter: [BezierCurve, BezierCurve],
    topLeftInner: [BezierCurve, BezierCurve],
    topRightOuter: [BezierCurve, BezierCurve],
    topRightInner: [BezierCurve, BezierCurve],
    bottomRightOuter: [BezierCurve, BezierCurve],
    bottomRightInner: [BezierCurve, BezierCurve],
    bottomLeftOuter: [BezierCurve, BezierCurve],
    bottomLeftInner: [BezierCurve, BezierCurve]
};

export class Bounds {
    top: number;
    left: number;
    width: number;
    height: number;

    constructor(x: number, y: number, w: number, h: number) {
        this.left = x;
        this.top = y;
        this.width = w;
        this.height = h;
    }

    static fromClientRect(clientRect: ClientRect): Bounds {
        return new Bounds(clientRect.left, clientRect.top, clientRect.width, clientRect.height);
    }
}

export const parseBounds = (node: HTMLElement, isTransformed: boolean): Bounds => {
    return isTransformed ? offsetBounds(node) : Bounds.fromClientRect(node.getBoundingClientRect());
};

const offsetBounds = (node: HTMLElement): Bounds => {
    // //$FlowFixMe
    const parent = node.offsetParent ? offsetBounds(node.offsetParent) : {top: 0, left: 0};

    return new Bounds(
        node.offsetLeft + parent.left,
        node.offsetTop + parent.top,
        node.offsetWidth,
        node.offsetHeight
    );
};

export const calculatePaddingBox = (bounds: Bounds, borders: Array<Border>): Bounds => {
    return new Bounds(
        bounds.left + borders[LEFT].borderWidth,
        bounds.top + borders[TOP].borderWidth,
        bounds.width - (borders[RIGHT].borderWidth + borders[LEFT].borderWidth),
        bounds.height - (borders[TOP].borderWidth + borders[BOTTOM].borderWidth)
    );
};

export const calculateContentBox = (
    bounds: Bounds,
    padding: Padding,
    borders: Array<Border>
): Bounds => {
    // TODO support percentage paddings
    const paddingTop = padding[TOP].value;
    const paddingRight = padding[RIGHT].value;
    const paddingBottom = padding[BOTTOM].value;
    const paddingLeft = padding[LEFT].value;

    return new Bounds(
        bounds.left + paddingLeft + borders[LEFT].borderWidth,
        bounds.top + paddingTop + borders[TOP].borderWidth,
        bounds.width -
            (borders[RIGHT].borderWidth + borders[LEFT].borderWidth + paddingLeft + paddingRight),
        bounds.height -
            (borders[TOP].borderWidth + borders[BOTTOM].borderWidth + paddingTop + paddingBottom)
    );
};

export const parsePathForBorder = (curves: BoundCurves, borderSide: BorderSide): Path => {
    switch (borderSide) {
        case TOP:
            return createPathFromCurves(
                curves.topLeftOuter,
                curves.topLeftInner,
                curves.topRightOuter,
                curves.topRightInner
            );
        case RIGHT:
            return createPathFromCurves(
                curves.topRightOuter,
                curves.topRightInner,
                curves.bottomRightOuter,
                curves.bottomRightInner
            );
        case BOTTOM:
            return createPathFromCurves(
                curves.bottomRightOuter,
                curves.bottomRightInner,
                curves.bottomLeftOuter,
                curves.bottomLeftInner
            );
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
    outer1: [BezierCurve, BezierCurve],
    inner1: [BezierCurve, BezierCurve],
    outer2: [BezierCurve, BezierCurve],
    inner2: [BezierCurve, BezierCurve]
): Path => {
    const path = [];
    path.push(outer1[1]);
    path.push(outer2[0]);
    path.push(inner2[0].reverse());
    path.push(inner1[1].reverse());

    return path;
};

export const parseBoundCurves = (
    bounds: Bounds,
    borders: Array<Border>,
    borderRadius: Array<BorderRadius>
): BoundCurves => {
    // TODO support percentage borderRadius
    const tlh =
        borderRadius[0][0].value < bounds.width / 2 ? borderRadius[0][0].value : bounds.width / 2;
    const tlv =
        borderRadius[0][1].value < bounds.height / 2 ? borderRadius[0][1].value : bounds.height / 2;
    const trh =
        borderRadius[1][0].value < bounds.width / 2 ? borderRadius[1][0].value : bounds.width / 2;
    const trv =
        borderRadius[1][1].value < bounds.height / 2 ? borderRadius[1][1].value : bounds.height / 2;
    const brh =
        borderRadius[2][0].value < bounds.width / 2 ? borderRadius[2][0].value : bounds.width / 2;
    const brv =
        borderRadius[2][1].value < bounds.height / 2 ? borderRadius[2][1].value : bounds.height / 2;
    const blh =
        borderRadius[3][0].value < bounds.width / 2 ? borderRadius[3][0].value : bounds.width / 2;
    const blv =
        borderRadius[3][1].value < bounds.height / 2 ? borderRadius[3][1].value : bounds.height / 2;

    const topWidth = bounds.width - trh;
    const rightHeight = bounds.height - brv;
    const bottomWidth = bounds.width - brh;
    const leftHeight = bounds.height - blv;

    return {
        topLeftOuter: getCurvePoints(bounds.left, bounds.top, tlh, tlv, CORNER.TOP_LEFT).subdivide(
            0.5
        ),
        topLeftInner: getCurvePoints(
            bounds.left + borders[3].borderWidth,
            bounds.top + borders[0].borderWidth,
            Math.max(0, tlh - borders[3].borderWidth),
            Math.max(0, tlv - borders[0].borderWidth),
            CORNER.TOP_LEFT
        ).subdivide(0.5),
        topRightOuter: getCurvePoints(
            bounds.left + topWidth,
            bounds.top,
            trh,
            trv,
            CORNER.TOP_RIGHT
        ).subdivide(0.5),
        topRightInner: getCurvePoints(
            bounds.left + Math.min(topWidth, bounds.width + borders[3].borderWidth),
            bounds.top + borders[0].borderWidth,
            topWidth > bounds.width + borders[3].borderWidth ? 0 : trh - borders[3].borderWidth,
            trv - borders[0].borderWidth,
            CORNER.TOP_RIGHT
        ).subdivide(0.5),
        bottomRightOuter: getCurvePoints(
            bounds.left + bottomWidth,
            bounds.top + rightHeight,
            brh,
            brv,
            CORNER.BOTTOM_RIGHT
        ).subdivide(0.5),
        bottomRightInner: getCurvePoints(
            bounds.left + Math.min(bottomWidth, bounds.width - borders[3].borderWidth),
            bounds.top + Math.min(rightHeight, bounds.height + borders[0].borderWidth),
            Math.max(0, brh - borders[1].borderWidth),
            brv - borders[2].borderWidth,
            CORNER.BOTTOM_RIGHT
        ).subdivide(0.5),
        bottomLeftOuter: getCurvePoints(
            bounds.left,
            bounds.top + leftHeight,
            blh,
            blv,
            CORNER.BOTTOM_LEFT
        ).subdivide(0.5),
        bottomLeftInner: getCurvePoints(
            bounds.left + borders[3].borderWidth,
            bounds.top + leftHeight,
            Math.max(0, blh - borders[3].borderWidth),
            blv - borders[2].borderWidth,
            CORNER.BOTTOM_LEFT
        ).subdivide(0.5)
    };
};

const CORNER = {
    TOP_LEFT: 0,
    TOP_RIGHT: 1,
    BOTTOM_RIGHT: 2,
    BOTTOM_LEFT: 3
};

type Corner = $Values<typeof CORNER>;

const getCurvePoints = (
    x: number,
    y: number,
    r1: number,
    r2: number,
    position: Corner
): BezierCurve => {
    const kappa = 4 * ((Math.sqrt(2) - 1) / 3);
    const ox = r1 * kappa; // control point offset horizontal
    const oy = r2 * kappa; // control point offset vertical
    const xm = x + r1; // x-middle
    const ym = y + r2; // y-middle

    switch (position) {
        case CORNER.TOP_LEFT:
            return new BezierCurve(
                new Vector(x, ym),
                new Vector(x, ym - oy),
                new Vector(xm - ox, y),
                new Vector(xm, y)
            );
        case CORNER.TOP_RIGHT:
            return new BezierCurve(
                new Vector(x, y),
                new Vector(x + ox, y),
                new Vector(xm, ym - oy),
                new Vector(xm, ym)
            );
        case CORNER.BOTTOM_RIGHT:
            return new BezierCurve(
                new Vector(xm, y),
                new Vector(xm, y + oy),
                new Vector(x + ox, ym),
                new Vector(x, ym)
            );
    }
    return new BezierCurve(
        new Vector(xm, ym),
        new Vector(xm - ox, ym),
        new Vector(x, y + oy),
        new Vector(x, y)
    );
};
