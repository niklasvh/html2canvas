import {Bounds} from '../css/layout/bounds';
import {BACKGROUND_ORIGIN} from '../css/property-descriptors/background-origin';
import {ElementContainer} from '../dom/element-container';
import {BACKGROUND_SIZE, BackgroundSizeInfo} from '../css/property-descriptors/background-size';
import {Vector} from './vector';
import {BACKGROUND_REPEAT} from '../css/property-descriptors/background-repeat';
import {getAbsoluteValue, isLengthPercentage} from '../css/types/length-percentage';
import {CSSValue, isIdentToken} from '../css/syntax/parser';
import {contentBox, paddingBox} from './box-sizing';

export const calculateBackgroungPositioningArea = (
    backgroundOrigin: BACKGROUND_ORIGIN,
    element: ElementContainer
): Bounds => {
    if (backgroundOrigin === BACKGROUND_ORIGIN.BORDER_BOX) {
        return element.bounds;
    }

    if (backgroundOrigin === BACKGROUND_ORIGIN.CONTENT_BOX) {
        return contentBox(element);
    }

    return paddingBox(element);
};

export const isAuto = (token: CSSValue): boolean => isIdentToken(token) && token.value === BACKGROUND_SIZE.AUTO;

export const calculateBackgroundSize = (
    size: BackgroundSizeInfo[],
    image: HTMLImageElement,
    bounds: Bounds
): [number, number] => {
    let width = 0;
    let height = 0;

    const [first, second] = size;

    if (isIdentToken(first) && (first.value === BACKGROUND_SIZE.CONTAIN || first.value === BACKGROUND_SIZE.COVER)) {
        const targetRatio = bounds.width / bounds.height;
        const currentRatio = image.width / image.height;
        return targetRatio < currentRatio !== (first.value === BACKGROUND_SIZE.COVER)
            ? [bounds.width, bounds.width / currentRatio]
            : [bounds.height * currentRatio, bounds.height];
    }

    if (isLengthPercentage(first)) {
        width = getAbsoluteValue(first, bounds.width);
    }

    if (isAuto(first) && (!second || isAuto(second))) {
        height = image.height;
    } else if (!second || isAuto(second)) {
        height = (width / image.width) * image.height;
    } else if (second && isLengthPercentage(second)) {
        height = getAbsoluteValue(second, bounds.height);
    }

    if (isAuto(first)) {
        width = (height / image.height) * image.width;
    }

    return [width, height];
};

export const getBackgroundValueForIndex = <T>(values: T[], index: number): T => {
    const value = values[index];
    if (typeof value === 'undefined') {
        return values[0];
    }

    return value;
};

export const calculateBackgroundRepeatPath = (
    repeat: BACKGROUND_REPEAT,
    [x, y]: [number, number],
    [width, height]: [number, number],
    backgroundPositioningArea: Bounds,
    bounds: Bounds
) => {
    switch (repeat) {
        case BACKGROUND_REPEAT.REPEAT_X:
            return [
                new Vector(Math.round(bounds.left), Math.round(backgroundPositioningArea.top + y)),
                new Vector(Math.round(bounds.left + bounds.width), Math.round(backgroundPositioningArea.top + y)),
                new Vector(
                    Math.round(bounds.left + bounds.width),
                    Math.round(height + backgroundPositioningArea.top + y)
                ),
                new Vector(Math.round(bounds.left), Math.round(height + backgroundPositioningArea.top + y))
            ];
        case BACKGROUND_REPEAT.REPEAT_Y:
            return [
                new Vector(Math.round(backgroundPositioningArea.left + x), Math.round(bounds.top)),
                new Vector(Math.round(backgroundPositioningArea.left + x + width), Math.round(bounds.top)),
                new Vector(
                    Math.round(backgroundPositioningArea.left + x + width),
                    Math.round(bounds.height + bounds.top)
                ),
                new Vector(Math.round(backgroundPositioningArea.left + x), Math.round(bounds.height + bounds.top))
            ];
        case BACKGROUND_REPEAT.NO_REPEAT:
            return [
                new Vector(
                    Math.round(backgroundPositioningArea.left + x),
                    Math.round(backgroundPositioningArea.top + y)
                ),
                new Vector(
                    Math.round(backgroundPositioningArea.left + x + width),
                    Math.round(backgroundPositioningArea.top + y)
                ),
                new Vector(
                    Math.round(backgroundPositioningArea.left + x + width),
                    Math.round(backgroundPositioningArea.top + y + height)
                ),
                new Vector(
                    Math.round(backgroundPositioningArea.left + x),
                    Math.round(backgroundPositioningArea.top + y + height)
                )
            ];
        default:
            return [
                new Vector(Math.round(bounds.left), Math.round(bounds.top)),
                new Vector(Math.round(bounds.left + bounds.width), Math.round(bounds.top)),
                new Vector(Math.round(bounds.left + bounds.width), Math.round(bounds.height + bounds.top)),
                new Vector(Math.round(bounds.left), Math.round(bounds.height + bounds.top))
            ];
    }
};
