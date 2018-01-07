/* @flow */
'use strict';

import type {Border, BorderSide} from './parsing/border';
import type {BorderRadius} from './parsing/borderRadius';
import type {Padding} from './parsing/padding';
import type {Path} from './drawing/Path';

import Vector from './drawing/Vector';
import BezierCurve from './drawing/BezierCurve';

const TOP = 0;
const RIGHT = 1;
const BOTTOM = 2;
const LEFT = 3;

const H = 0;
const V = 1;

export type BoundCurves = {
    topLeftOuter: BezierCurve | Vector,
    topLeftInner: BezierCurve | Vector,
    topRightOuter: BezierCurve | Vector,
    topRightInner: BezierCurve | Vector,
    bottomRightOuter: BezierCurve | Vector,
    bottomRightInner: BezierCurve | Vector,
    bottomLeftOuter: BezierCurve | Vector,
    bottomLeftInner: BezierCurve | Vector
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

    static fromClientRect(clientRect: ClientRect, scrollX: number, scrollY: number): Bounds {
        return new Bounds(
            clientRect.left + scrollX,
            clientRect.top + scrollY,
            clientRect.width,
            clientRect.height
        );
    }
}

export const parseBounds = (
    node: HTMLElement | SVGSVGElement,
    scrollX: number,
    scrollY: number
): Bounds => {
    return Bounds.fromClientRect(node.getBoundingClientRect(), scrollX, scrollY);
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

export const parseDocumentSize = (document: Document): Bounds => {
    const body = document.body;
    const documentElement = document.documentElement;

    if (!body || !documentElement) {
        throw new Error(__DEV__ ? `Unable to get document size` : '');
    }
    const width = Math.max(
        Math.max(body.scrollWidth, documentElement.scrollWidth),
        Math.max(body.offsetWidth, documentElement.offsetWidth),
        Math.max(body.clientWidth, documentElement.clientWidth)
    );

    const height = Math.max(
        Math.max(body.scrollHeight, documentElement.scrollHeight),
        Math.max(body.offsetHeight, documentElement.offsetHeight),
        Math.max(body.clientHeight, documentElement.clientHeight)
    );

    return new Bounds(0, 0, width, height);
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
        case LEFT:
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
    outer1: BezierCurve | Vector,
    inner1: BezierCurve | Vector,
    outer2: BezierCurve | Vector,
    inner2: BezierCurve | Vector
): Path => {
    const path = [];
    if (outer1 instanceof BezierCurve) {
        path.push(outer1.subdivide(0.5, false));
    } else {
        path.push(outer1);
    }

    if (outer2 instanceof BezierCurve) {
        path.push(outer2.subdivide(0.5, true));
    } else {
        path.push(outer2);
    }

    if (inner2 instanceof BezierCurve) {
        path.push(inner2.subdivide(0.5, true).reverse());
    } else {
        path.push(inner2);
    }

    if (inner1 instanceof BezierCurve) {
        path.push(inner1.subdivide(0.5, false).reverse());
    } else {
        path.push(inner1);
    }

    return path;
};

export const calculateBorderBoxPath = (curves: BoundCurves): Path => {
    return [
        curves.topLeftOuter,
        curves.topRightOuter,
        curves.bottomRightOuter,
        curves.bottomLeftOuter
    ];
};

export const calculatePaddingBoxPath = (curves: BoundCurves): Path => {
    return [
        curves.topLeftInner,
        curves.topRightInner,
        curves.bottomRightInner,
        curves.bottomLeftInner
    ];
};

export const parseBoundCurves = (
    bounds: Bounds,
    borders: Array<Border>,
    borderRadius: Array<BorderRadius>
): BoundCurves => {
    let tlh = borderRadius[CORNER.TOP_LEFT][H].getAbsoluteValue(bounds.width);
    let tlv = borderRadius[CORNER.TOP_LEFT][V].getAbsoluteValue(bounds.height);
    let trh = borderRadius[CORNER.TOP_RIGHT][H].getAbsoluteValue(bounds.width);
    let trv = borderRadius[CORNER.TOP_RIGHT][V].getAbsoluteValue(bounds.height);
    let brh = borderRadius[CORNER.BOTTOM_RIGHT][H].getAbsoluteValue(bounds.width);
    let brv = borderRadius[CORNER.BOTTOM_RIGHT][V].getAbsoluteValue(bounds.height);
    let blh = borderRadius[CORNER.BOTTOM_LEFT][H].getAbsoluteValue(bounds.width);
    let blv = borderRadius[CORNER.BOTTOM_LEFT][V].getAbsoluteValue(bounds.height);

    const factors = [];
    factors.push((tlh + trh) / bounds.width);
    factors.push((blh + brh) / bounds.width);
    factors.push((tlv + blv) / bounds.height);
    factors.push((trv + brv) / bounds.height);
    const maxFactor = Math.max(...factors);

    if (maxFactor > 1) {
        tlh /= maxFactor;
        tlv /= maxFactor;
        trh /= maxFactor;
        trv /= maxFactor;
        brh /= maxFactor;
        brv /= maxFactor;
        blh /= maxFactor;
        blv /= maxFactor;
    }

    const topWidth = bounds.width - trh;
    const rightHeight = bounds.height - brv;
    const bottomWidth = bounds.width - brh;
    const leftHeight = bounds.height - blv;

    return {
        topLeftOuter:
            tlh > 0 || tlv > 0
                ? getCurvePoints(bounds.left, bounds.top, tlh, tlv, CORNER.TOP_LEFT)
                : new Vector(bounds.left, bounds.top),
        topLeftInner:
            tlh > 0 || tlv > 0
                ? getCurvePoints(
                      bounds.left + borders[LEFT].borderWidth,
                      bounds.top + borders[TOP].borderWidth,
                      Math.max(0, tlh - borders[LEFT].borderWidth),
                      Math.max(0, tlv - borders[TOP].borderWidth),
                      CORNER.TOP_LEFT
                  )
                : new Vector(
                      bounds.left + borders[LEFT].borderWidth,
                      bounds.top + borders[TOP].borderWidth
                  ),
        topRightOuter:
            trh > 0 || trv > 0
                ? getCurvePoints(bounds.left + topWidth, bounds.top, trh, trv, CORNER.TOP_RIGHT)
                : new Vector(bounds.left + bounds.width, bounds.top),
        topRightInner:
            trh > 0 || trv > 0
                ? getCurvePoints(
                      bounds.left + Math.min(topWidth, bounds.width + borders[LEFT].borderWidth),
                      bounds.top + borders[TOP].borderWidth,
                      topWidth > bounds.width + borders[LEFT].borderWidth
                          ? 0
                          : trh - borders[LEFT].borderWidth,
                      trv - borders[TOP].borderWidth,
                      CORNER.TOP_RIGHT
                  )
                : new Vector(
                      bounds.left + bounds.width - borders[RIGHT].borderWidth,
                      bounds.top + borders[TOP].borderWidth
                  ),
        bottomRightOuter:
            brh > 0 || brv > 0
                ? getCurvePoints(
                      bounds.left + bottomWidth,
                      bounds.top + rightHeight,
                      brh,
                      brv,
                      CORNER.BOTTOM_RIGHT
                  )
                : new Vector(bounds.left + bounds.width, bounds.top + bounds.height),
        bottomRightInner:
            brh > 0 || brv > 0
                ? getCurvePoints(
                      bounds.left + Math.min(bottomWidth, bounds.width - borders[LEFT].borderWidth),
                      bounds.top + Math.min(rightHeight, bounds.height + borders[TOP].borderWidth),
                      Math.max(0, brh - borders[RIGHT].borderWidth),
                      brv - borders[BOTTOM].borderWidth,
                      CORNER.BOTTOM_RIGHT
                  )
                : new Vector(
                      bounds.left + bounds.width - borders[RIGHT].borderWidth,
                      bounds.top + bounds.height - borders[BOTTOM].borderWidth
                  ),
        bottomLeftOuter:
            blh > 0 || blv > 0
                ? getCurvePoints(bounds.left, bounds.top + leftHeight, blh, blv, CORNER.BOTTOM_LEFT)
                : new Vector(bounds.left, bounds.top + bounds.height),
        bottomLeftInner:
            blh > 0 || blv > 0
                ? getCurvePoints(
                      bounds.left + borders[LEFT].borderWidth,
                      bounds.top + leftHeight,
                      Math.max(0, blh - borders[LEFT].borderWidth),
                      blv - borders[BOTTOM].borderWidth,
                      CORNER.BOTTOM_LEFT
                  )
                : new Vector(
                      bounds.left + borders[LEFT].borderWidth,
                      bounds.top + bounds.height - borders[BOTTOM].borderWidth
                  )
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
        case CORNER.BOTTOM_LEFT:
        default:
            return new BezierCurve(
                new Vector(xm, ym),
                new Vector(xm - ox, ym),
                new Vector(x, y + oy),
                new Vector(x, y)
            );
    }
};
