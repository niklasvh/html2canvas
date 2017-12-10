/* @flow */
'use strict';
import type {Path} from '../drawing/Path';
import type {BoundCurves} from '../Bounds';
import type ResourceLoader, {ImageElement} from '../ResourceLoader';
import type {Border} from './border';
import type {Padding} from './padding';

import Color from '../Color';
import Length from '../Length';
import Size from '../drawing/Size';
import Vector from '../drawing/Vector';
import {
    calculateBorderBoxPath,
    calculatePaddingBoxPath,
    calculatePaddingBox,
    Bounds
} from '../Bounds';
import {PADDING_SIDES} from './padding';

export type Background = {
    backgroundImage: Array<BackgroundImage>,
    backgroundClip: BackgroundClip,
    backgroundColor: Color,
    backgroundOrigin: BackgroundOrigin
};

export type BackgroundClip = $Values<typeof BACKGROUND_CLIP>;
export type BackgroundOrigin = $Values<typeof BACKGROUND_ORIGIN>;
export type BackgroundRepeat = $Values<typeof BACKGROUND_REPEAT>;
export type BackgroundSizeTypes = $Values<typeof BACKGROUND_SIZE>;

export type BackgroundSource = {
    prefix: string,
    method: string,
    args: Array<string>
};

export type BackgroundImage = {
    source: BackgroundSource,
    position: [Length, Length],
    size: [BackgroundSize, BackgroundSize],
    repeat: BackgroundRepeat
};

export const BACKGROUND_REPEAT = {
    REPEAT: 0,
    NO_REPEAT: 1,
    REPEAT_X: 2,
    REPEAT_Y: 3
};

export const BACKGROUND_SIZE = {
    AUTO: 0,
    CONTAIN: 1,
    COVER: 2,
    LENGTH: 3
};

export const BACKGROUND_CLIP = {
    BORDER_BOX: 0,
    PADDING_BOX: 1,
    CONTENT_BOX: 2
};

export const BACKGROUND_ORIGIN = BACKGROUND_CLIP;

const AUTO = 'auto';

class BackgroundSize {
    size: ?BackgroundSizeTypes;
    value: ?Length;

    constructor(size: string) {
        switch (size) {
            case 'contain':
                this.size = BACKGROUND_SIZE.CONTAIN;
                break;
            case 'cover':
                this.size = BACKGROUND_SIZE.COVER;
                break;
            case 'auto':
                this.size = BACKGROUND_SIZE.AUTO;
                break;
            default:
                this.value = new Length(size);
        }
    }
}

export const calculateBackgroundSize = (
    backgroundImage: BackgroundImage,
    image: ImageElement,
    bounds: Bounds
): Size => {
    let width = 0;
    let height = 0;
    const size = backgroundImage.size;
    if (size[0].size === BACKGROUND_SIZE.CONTAIN || size[0].size === BACKGROUND_SIZE.COVER) {
        const targetRatio = bounds.width / bounds.height;
        const currentRatio = image.width / image.height;
        return targetRatio < currentRatio !== (size[0].size === BACKGROUND_SIZE.COVER)
            ? new Size(bounds.width, bounds.width / currentRatio)
            : new Size(bounds.height * currentRatio, bounds.height);
    }

    if (size[0].value) {
        width = size[0].value.getAbsoluteValue(bounds.width);
    }

    if (size[0].size === BACKGROUND_SIZE.AUTO && size[1].size === BACKGROUND_SIZE.AUTO) {
        height = image.height;
    } else if (size[1].size === BACKGROUND_SIZE.AUTO) {
        height = width / image.width * image.height;
    } else if (size[1].value) {
        height = size[1].value.getAbsoluteValue(bounds.height);
    }

    if (size[0].size === BACKGROUND_SIZE.AUTO) {
        width = height / image.height * image.width;
    }

    return new Size(width, height);
};

export const calculateGradientBackgroundSize = (
    backgroundImage: BackgroundImage,
    bounds: Bounds
): Size => {
    const size = backgroundImage.size;
    const width = size[0].value ? size[0].value.getAbsoluteValue(bounds.width) : bounds.width;
    const height = size[1].value
        ? size[1].value.getAbsoluteValue(bounds.height)
        : size[0].value ? width : bounds.height;

    return new Size(width, height);
};

const AUTO_SIZE = new BackgroundSize(AUTO);

export const calculateBackgroungPaintingArea = (
    curves: BoundCurves,
    clip: BackgroundClip
): Path => {
    switch (clip) {
        case BACKGROUND_CLIP.BORDER_BOX:
            return calculateBorderBoxPath(curves);
        case BACKGROUND_CLIP.PADDING_BOX:
        default:
            return calculatePaddingBoxPath(curves);
    }
};

export const calculateBackgroungPositioningArea = (
    backgroundOrigin: BackgroundOrigin,
    bounds: Bounds,
    padding: Padding,
    border: Array<Border>
): Bounds => {
    const paddingBox = calculatePaddingBox(bounds, border);

    switch (backgroundOrigin) {
        case BACKGROUND_ORIGIN.BORDER_BOX:
            return bounds;
        case BACKGROUND_ORIGIN.CONTENT_BOX:
            const paddingLeft = padding[PADDING_SIDES.LEFT].getAbsoluteValue(bounds.width);
            const paddingRight = padding[PADDING_SIDES.RIGHT].getAbsoluteValue(bounds.width);
            const paddingTop = padding[PADDING_SIDES.TOP].getAbsoluteValue(bounds.width);
            const paddingBottom = padding[PADDING_SIDES.BOTTOM].getAbsoluteValue(bounds.width);
            return new Bounds(
                paddingBox.left + paddingLeft,
                paddingBox.top + paddingTop,
                paddingBox.width - paddingLeft - paddingRight,
                paddingBox.height - paddingTop - paddingBottom
            );
        case BACKGROUND_ORIGIN.PADDING_BOX:
        default:
            return paddingBox;
    }
};

export const calculateBackgroundPosition = (
    position: [Length, Length],
    size: Size,
    bounds: Bounds
): Vector => {
    return new Vector(
        position[0].getAbsoluteValue(bounds.width - size.width),
        position[1].getAbsoluteValue(bounds.height - size.height)
    );
};

export const calculateBackgroundRepeatPath = (
    background: BackgroundImage,
    position: Vector,
    size: Size,
    backgroundPositioningArea: Bounds,
    bounds: Bounds
) => {
    const repeat = background.repeat;
    switch (repeat) {
        case BACKGROUND_REPEAT.REPEAT_X:
            return [
                new Vector(
                    Math.round(bounds.left),
                    Math.round(backgroundPositioningArea.top + position.y)
                ),
                new Vector(
                    Math.round(bounds.left + bounds.width),
                    Math.round(backgroundPositioningArea.top + position.y)
                ),
                new Vector(
                    Math.round(bounds.left + bounds.width),
                    Math.round(size.height + backgroundPositioningArea.top + position.y)
                ),
                new Vector(
                    Math.round(bounds.left),
                    Math.round(size.height + backgroundPositioningArea.top + position.y)
                )
            ];
        case BACKGROUND_REPEAT.REPEAT_Y:
            return [
                new Vector(
                    Math.round(backgroundPositioningArea.left + position.x),
                    Math.round(bounds.top)
                ),
                new Vector(
                    Math.round(backgroundPositioningArea.left + position.x + size.width),
                    Math.round(bounds.top)
                ),
                new Vector(
                    Math.round(backgroundPositioningArea.left + position.x + size.width),
                    Math.round(bounds.height + bounds.top)
                ),
                new Vector(
                    Math.round(backgroundPositioningArea.left + position.x),
                    Math.round(bounds.height + bounds.top)
                )
            ];
        case BACKGROUND_REPEAT.NO_REPEAT:
            return [
                new Vector(
                    Math.round(backgroundPositioningArea.left + position.x),
                    Math.round(backgroundPositioningArea.top + position.y)
                ),
                new Vector(
                    Math.round(backgroundPositioningArea.left + position.x + size.width),
                    Math.round(backgroundPositioningArea.top + position.y)
                ),
                new Vector(
                    Math.round(backgroundPositioningArea.left + position.x + size.width),
                    Math.round(backgroundPositioningArea.top + position.y + size.height)
                ),
                new Vector(
                    Math.round(backgroundPositioningArea.left + position.x),
                    Math.round(backgroundPositioningArea.top + position.y + size.height)
                )
            ];
        default:
            return [
                new Vector(Math.round(bounds.left), Math.round(bounds.top)),
                new Vector(Math.round(bounds.left + bounds.width), Math.round(bounds.top)),
                new Vector(
                    Math.round(bounds.left + bounds.width),
                    Math.round(bounds.height + bounds.top)
                ),
                new Vector(Math.round(bounds.left), Math.round(bounds.height + bounds.top))
            ];
    }
};

export const parseBackground = (
    style: CSSStyleDeclaration,
    resourceLoader: ResourceLoader
): Background => {
    return {
        backgroundColor: new Color(style.backgroundColor),
        backgroundImage: parseBackgroundImages(style, resourceLoader),
        backgroundClip: parseBackgroundClip(style.backgroundClip),
        backgroundOrigin: parseBackgroundOrigin(style.backgroundOrigin)
    };
};

const parseBackgroundClip = (backgroundClip: string): BackgroundClip => {
    switch (backgroundClip) {
        case 'padding-box':
            return BACKGROUND_CLIP.PADDING_BOX;
        case 'content-box':
            return BACKGROUND_CLIP.CONTENT_BOX;
    }
    return BACKGROUND_CLIP.BORDER_BOX;
};

const parseBackgroundOrigin = (backgroundOrigin: string): BackgroundOrigin => {
    switch (backgroundOrigin) {
        case 'padding-box':
            return BACKGROUND_ORIGIN.PADDING_BOX;
        case 'content-box':
            return BACKGROUND_ORIGIN.CONTENT_BOX;
    }
    return BACKGROUND_ORIGIN.BORDER_BOX;
};

const parseBackgroundRepeat = (backgroundRepeat: string): BackgroundRepeat => {
    switch (backgroundRepeat.trim()) {
        case 'no-repeat':
            return BACKGROUND_REPEAT.NO_REPEAT;
        case 'repeat-x':
        case 'repeat no-repeat':
            return BACKGROUND_REPEAT.REPEAT_X;
        case 'repeat-y':
        case 'no-repeat repeat':
            return BACKGROUND_REPEAT.REPEAT_Y;
        case 'repeat':
            return BACKGROUND_REPEAT.REPEAT;
    }

    if (__DEV__) {
        console.error(`Invalid background-repeat value "${backgroundRepeat}"`);
    }

    return BACKGROUND_REPEAT.REPEAT;
};

const parseBackgroundImages = (
    style: CSSStyleDeclaration,
    resourceLoader: ResourceLoader
): Array<BackgroundImage> => {
    const sources: Array<BackgroundSource> = parseBackgroundImage(
        style.backgroundImage
    ).map(backgroundImage => {
        if (backgroundImage.method === 'url') {
            const key = resourceLoader.loadImage(backgroundImage.args[0]);
            backgroundImage.args = key ? [key] : [];
        }
        return backgroundImage;
    });
    const positions = style.backgroundPosition.split(',');
    const repeats = style.backgroundRepeat.split(',');
    const sizes = style.backgroundSize.split(',');

    return sources.map((source, index) => {
        const size = (sizes[index] || AUTO).trim().split(' ').map(parseBackgroundSize);
        const position = (positions[index] || AUTO).trim().split(' ').map(parseBackgoundPosition);

        return {
            source,
            repeat: parseBackgroundRepeat(
                typeof repeats[index] === 'string' ? repeats[index] : repeats[0]
            ),
            size: size.length < 2 ? [size[0], AUTO_SIZE] : [size[0], size[1]],
            position: position.length < 2 ? [position[0], position[0]] : [position[0], position[1]]
        };
    });
};

const parseBackgroundSize = (size: string): BackgroundSize =>
    size === 'auto' ? AUTO_SIZE : new BackgroundSize(size);

const parseBackgoundPosition = (position: string): Length => {
    switch (position) {
        case 'bottom':
        case 'right':
            return new Length('100%');
        case 'left':
        case 'top':
            return new Length('0%');
        case 'auto':
            return new Length('0');
    }
    return new Length(position);
};

export const parseBackgroundImage = (image: string): Array<BackgroundSource> => {
    const whitespace = /^\s$/;
    const results = [];

    let args = [];
    let method = '';
    let quote = null;
    let definition = '';
    let mode = 0;
    let numParen = 0;

    const appendResult = () => {
        let prefix = '';
        if (method) {
            if (definition.substr(0, 1) === '"') {
                definition = definition.substr(1, definition.length - 2);
            }

            if (definition) {
                args.push(definition.trim());
            }

            const prefix_i = method.indexOf('-', 1) + 1;
            if (method.substr(0, 1) === '-' && prefix_i > 0) {
                prefix = method.substr(0, prefix_i).toLowerCase();
                method = method.substr(prefix_i);
            }
            method = method.toLowerCase();
            if (method !== 'none') {
                results.push({
                    prefix,
                    method,
                    args
                });
            }
        }
        args = [];
        method = definition = '';
    };

    image.split('').forEach(c => {
        if (mode === 0 && whitespace.test(c)) {
            return;
        }
        switch (c) {
            case '"':
                if (!quote) {
                    quote = c;
                } else if (quote === c) {
                    quote = null;
                }
                break;
            case '(':
                if (quote) {
                    break;
                } else if (mode === 0) {
                    mode = 1;
                    return;
                } else {
                    numParen++;
                }
                break;
            case ')':
                if (quote) {
                    break;
                } else if (mode === 1) {
                    if (numParen === 0) {
                        mode = 0;
                        appendResult();
                        return;
                    } else {
                        numParen--;
                    }
                }
                break;

            case ',':
                if (quote) {
                    break;
                } else if (mode === 0) {
                    appendResult();
                    return;
                } else if (mode === 1) {
                    if (numParen === 0 && !method.match(/^url$/i)) {
                        args.push(definition.trim());
                        definition = '';
                        return;
                    }
                }
                break;
        }

        if (mode === 0) {
            method += c;
        } else {
            definition += c;
        }
    });

    appendResult();
    return results;
};
