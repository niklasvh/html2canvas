/* @flow */
'use strict';

import type {Bounds} from '../Bounds';
import type ImageLoader from '../ImageLoader';

import Color from '../Color';
import Length from '../Length';
import Size from '../Size';
import Vector from '../Vector';

export type Background = {
    backgroundImage: Array<BackgroundImage>,
    backgroundColor: Color
};

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
    image: HTMLImageElement,
    bounds: Bounds
): Size => {
    let width = 0;
    let height = 0;
    const size = backgroundImage.size;
    if (size[0].size === BACKGROUND_SIZE.CONTAIN || size[0].size === BACKGROUND_SIZE.COVER) {
        const targetRatio = bounds.width / bounds.height;
        const currentRatio = image.width / image.height;
        return targetRatio < currentRatio !== (size[0].size === BACKGROUND_SIZE.COVER)
            ? new Size(bounds.height * currentRatio, bounds.height)
            : new Size(bounds.width, bounds.width / currentRatio);
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

const AUTO_SIZE = new BackgroundSize(AUTO);

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
    bounds: Bounds
) => {
    const repeat = background.repeat;
    switch (repeat) {
        case BACKGROUND_REPEAT.REPEAT_X:
            return [
                new Vector(Math.round(bounds.left), Math.round(bounds.top + position.y)),
                new Vector(
                    Math.round(bounds.left + bounds.width),
                    Math.round(bounds.top + position.y)
                ),
                new Vector(
                    Math.round(bounds.left + bounds.width),
                    Math.round(size.height + bounds.top + position.y)
                ),
                new Vector(
                    Math.round(bounds.left),
                    Math.round(size.height + bounds.top + position.y)
                )
            ];
        case BACKGROUND_REPEAT.REPEAT_Y:
            return [
                new Vector(Math.round(bounds.left + position.x), Math.round(bounds.top)),
                new Vector(
                    Math.round(bounds.left + position.x + size.width),
                    Math.round(bounds.top)
                ),
                new Vector(
                    Math.round(bounds.left + position.x + size.width),
                    Math.round(bounds.height + bounds.top)
                ),
                new Vector(
                    Math.round(bounds.left + position.x),
                    Math.round(bounds.height + bounds.top)
                )
            ];
        case BACKGROUND_REPEAT.NO_REPEAT:
            return [
                new Vector(
                    Math.round(bounds.left + position.x),
                    Math.round(bounds.top + position.y)
                ),
                new Vector(
                    Math.round(bounds.left + position.x + size.width),
                    Math.round(bounds.top + position.y)
                ),
                new Vector(
                    Math.round(bounds.left + position.x + size.width),
                    Math.round(bounds.top + position.y + size.height)
                ),
                new Vector(
                    Math.round(bounds.left + position.x),
                    Math.round(bounds.top + position.y + size.height)
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
    imageLoader: ImageLoader
): Background => {
    return {
        backgroundImage: parseBackgroundImages(style, imageLoader),
        backgroundColor: new Color(style.backgroundColor)
    };
};

const parseBackgroundRepeat = (backgroundRepeat: string): BackgroundRepeat => {
    switch (backgroundRepeat) {
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
    imageLoader: ImageLoader
): Array<BackgroundImage> => {
    const sources: Array<BackgroundSource> = parseBackgroundImage(
        style.backgroundImage,
        imageLoader
    );
    const positions = style.backgroundPosition.split(',');
    const repeats = style.backgroundRepeat.split(',');
    const sizes = style.backgroundSize.split(',');

    return sources.map((source, index) => {
        const size = (sizes[index] || AUTO).trim().split(' ').map(parseBackgroundSize);
        const position = (positions[index] || AUTO).trim().split(' ').map(parseBackgoundPosition);

        return {
            source,
            repeat: parseBackgroundRepeat(repeats[index]),
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

const parseBackgroundImage = (image: string, imageLoader: ImageLoader): Array<BackgroundSource> => {
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
                args.push(definition);
            }

            const prefix_i = method.indexOf('-', 1) + 1;
            if (method.substr(0, 1) === '-' && prefix_i > 0) {
                prefix = method.substr(0, prefix_i).toLowerCase();
                method = method.substr(prefix_i);
            }
            method = method.toLowerCase();
            if (method === 'url') {
                const key = imageLoader.loadImage(args[0]);
                args = key ? [key] : [];
            }
            results.push({
                prefix,
                method,
                args
            });
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
                        args.push(definition);
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
