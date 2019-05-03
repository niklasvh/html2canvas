import {ElementContainer} from "../dom/element-container";
import {getAbsoluteValueForTuple} from "../css/types/length-percentage";
import {Vector} from "./vector";
import {BezierCurve} from "./bezier-curve";
import {Path} from "./path";

export class BoundCurves {
    readonly topLeftOuter: Path;
    readonly topLeftInner: Path;
    readonly topRightOuter: Path;
    readonly topRightInner: Path;
    readonly bottomRightOuter: Path;
    readonly bottomRightInner: Path;
    readonly bottomLeftOuter: Path;
    readonly bottomLeftInner: Path;

    constructor(element: ElementContainer) {
        const styles = element.styles;
        const bounds = element.bounds;

        let [tlh, tlv] = getAbsoluteValueForTuple(styles.borderTopLeftRadius, bounds.width, bounds.height);
        let [trh, trv] = getAbsoluteValueForTuple(styles.borderTopRightRadius, bounds.width, bounds.height);
        let [brh, brv] = getAbsoluteValueForTuple(styles.borderBottomRightRadius, bounds.width, bounds.height);
        let [blh, blv] = getAbsoluteValueForTuple(styles.borderBottomLeftRadius, bounds.width, bounds.height);

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

        const borderTopWidth = styles.borderTopWidth;
        const borderRightWidth = styles.borderRightWidth;
        const borderBottomWidth = styles.borderBottomWidth;
        const borderLeftWidth = styles.borderLeftWidth;

        this.topLeftOuter =
            tlh > 0 || tlv > 0
                ? getCurvePoints(bounds.left, bounds.top, tlh, tlv, CORNER.TOP_LEFT)
                : new Vector(bounds.left, bounds.top);
        this.topLeftInner =
            tlh > 0 || tlv > 0
                ? getCurvePoints(
                bounds.left + borderLeftWidth,
                bounds.top + borderTopWidth,
                Math.max(0, tlh - borderLeftWidth),
                Math.max(0, tlv - borderTopWidth),
                CORNER.TOP_LEFT
            )
                : new Vector(
                bounds.left + borderLeftWidth,
                bounds.top + borderTopWidth
            );
        this.topRightOuter =
            trh > 0 || trv > 0
                ? getCurvePoints(bounds.left + topWidth, bounds.top, trh, trv, CORNER.TOP_RIGHT)
                : new Vector(bounds.left + bounds.width, bounds.top);
        this.topRightInner =
            trh > 0 || trv > 0
                ? getCurvePoints(
                bounds.left + Math.min(topWidth, bounds.width + borderLeftWidth),
                bounds.top + borderTopWidth,
                topWidth > bounds.width + borderLeftWidth
                    ? 0
                    : trh - borderLeftWidth,
                trv - borderTopWidth,
                CORNER.TOP_RIGHT
            )
                : new Vector(
                bounds.left + bounds.width - borderRightWidth,
                bounds.top + borderTopWidth
            );
        this.bottomRightOuter =
            brh > 0 || brv > 0
                ? getCurvePoints(
                bounds.left + bottomWidth,
                bounds.top + rightHeight,
                brh,
                brv,
                CORNER.BOTTOM_RIGHT
            )
                : new Vector(bounds.left + bounds.width, bounds.top + bounds.height);
        this.bottomRightInner =
            brh > 0 || brv > 0
                ? getCurvePoints(
                bounds.left + Math.min(bottomWidth, bounds.width - borderLeftWidth),
                bounds.top + Math.min(rightHeight, bounds.height + borderTopWidth),
                Math.max(0, brh - borderRightWidth),
                brv - borderBottomWidth,
                CORNER.BOTTOM_RIGHT
            )
                : new Vector(
                bounds.left + bounds.width - borderRightWidth,
                bounds.top + bounds.height - borderBottomWidth
            );
        this.bottomLeftOuter =
            blh > 0 || blv > 0
                ? getCurvePoints(bounds.left, bounds.top + leftHeight, blh, blv, CORNER.BOTTOM_LEFT)
                : new Vector(bounds.left, bounds.top + bounds.height);
        this.bottomLeftInner =
            blh > 0 || blv > 0
                ? getCurvePoints(
                bounds.left + borderLeftWidth,
                bounds.top + leftHeight,
                Math.max(0, blh - borderLeftWidth),
                blv - borderBottomWidth,
                CORNER.BOTTOM_LEFT
            )
                : new Vector(
                bounds.left + borderLeftWidth,
                bounds.top + bounds.height - borderBottomWidth
            );
    }
}

enum CORNER {
    TOP_LEFT = 0,
    TOP_RIGHT = 1,
    BOTTOM_RIGHT = 2,
    BOTTOM_LEFT = 3
}

const getCurvePoints = (
    x: number,
    y: number,
    r1: number,
    r2: number,
    position: CORNER
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

export const calculateBorderBoxPath = (curves: BoundCurves): Path[] => {
    return [
        curves.topLeftOuter,
        curves.topRightOuter,
        curves.bottomRightOuter,
        curves.bottomLeftOuter
    ];
};

export const calculatePaddingBoxPath = (curves: BoundCurves): Path[] => {
    return [
        curves.topLeftInner,
        curves.topRightInner,
        curves.bottomRightInner,
        curves.bottomLeftInner
    ];
};
