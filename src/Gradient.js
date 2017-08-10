/* @flow */
'use strict';

import type {BackgroundSource} from './parsing/background';
import type {Bounds} from './Bounds';
import {parseAngle} from './Angle';
import Color from './Color';
import Length, {LENGTH_TYPE} from './Length';

const SIDE_OR_CORNER = /^(to )?(left|top|right|bottom)( (left|top|right|bottom))?$/i;
const PERCENTAGE_ANGLES = /^([+-]?\d*\.?\d+)% ([+-]?\d*\.?\d+)%$/i;
const ENDS_WITH_LENGTH = /(px)|%|( 0)$/i;
const FROM_TO = /^(from|to)\((.+)\)$/i;

export type Direction = {
    x0: number,
    x1: number,
    y0: number,
    y1: number
};

export type ColorStop = {
    color: Color,
    stop: number
};

export type Gradient = {
    direction: Direction,
    colorStops: Array<ColorStop>
};

export const parseGradient = (
    {args, method, prefix}: BackgroundSource,
    bounds: Bounds
): ?Gradient => {
    if (method === 'linear-gradient') {
        return parseLinearGradient(args, bounds);
    } else if (method === 'gradient' && args[0] === 'linear') {
        // TODO handle correct angle
        return parseLinearGradient(
            ['to bottom'].concat(
                args
                    .slice(3)
                    .map(color => color.match(FROM_TO))
                    .filter(v => v !== null)
                    // $FlowFixMe
                    .map(v => v[2])
            ),
            bounds
        );
    }
};

const parseLinearGradient = (args: Array<string>, bounds: Bounds): Gradient => {
    const angle = parseAngle(args[0]);
    const HAS_SIDE_OR_CORNER = SIDE_OR_CORNER.test(args[0]);
    const HAS_DIRECTION = HAS_SIDE_OR_CORNER || angle !== null || PERCENTAGE_ANGLES.test(args[0]);
    const direction = HAS_DIRECTION
        ? angle !== null
          ? calculateGradientDirection(angle, bounds)
          : HAS_SIDE_OR_CORNER
            ? parseSideOrCorner(args[0], bounds)
            : parsePercentageAngle(args[0], bounds)
        : calculateGradientDirection(Math.PI, bounds);
    const colorStops = [];
    const firstColorStopIndex = HAS_DIRECTION ? 1 : 0;

    for (let i = firstColorStopIndex; i < args.length; i++) {
        const value = args[i];
        const HAS_LENGTH = ENDS_WITH_LENGTH.test(value);
        const lastSpaceIndex = value.lastIndexOf(' ');
        const color = new Color(HAS_LENGTH ? value.substring(0, lastSpaceIndex) : value);
        const stop = HAS_LENGTH
            ? new Length(value.substring(lastSpaceIndex + 1))
            : i === firstColorStopIndex
              ? new Length('0%')
              : i === args.length - 1 ? new Length('100%') : null;
        colorStops.push({color, stop});
    }

    // TODO: Fix some inaccuracy with color stops with px values
    const lineLength = Math.min(
        Math.sqrt(
            Math.pow(Math.abs(direction.x0) + Math.abs(direction.x1), 2) +
                Math.pow(Math.abs(direction.y0) + Math.abs(direction.y1), 2)
        ),
        bounds.width * 2,
        bounds.height * 2
    );

    const absoluteValuedColorStops = colorStops.map(({color, stop}) => {
        return {
            color,
            // $FlowFixMe
            stop: stop ? stop.getAbsoluteValue(lineLength) / lineLength : null
        };
    });

    let previousColorStop = absoluteValuedColorStops[0].stop;
    for (let i = 0; i < absoluteValuedColorStops.length; i++) {
        if (previousColorStop !== null) {
            const stop = absoluteValuedColorStops[i].stop;
            if (stop === null) {
                let n = i;
                while (absoluteValuedColorStops[n].stop === null) {
                    n++;
                }
                const steps = n - i + 1;
                const nextColorStep = absoluteValuedColorStops[n].stop;
                const stepSize = (nextColorStep - previousColorStop) / steps;
                for (; i < n; i++) {
                    previousColorStop = absoluteValuedColorStops[i].stop =
                        previousColorStop + stepSize;
                }
            } else {
                previousColorStop = stop;
            }
        }
    }

    return {
        direction,
        colorStops: absoluteValuedColorStops
    };
};

const calculateGradientDirection = (radian: number, bounds: Bounds): Direction => {
    const width = bounds.width;
    const height = bounds.height;
    const HALF_WIDTH = width * 0.5;
    const HALF_HEIGHT = height * 0.5;
    const lineLength = Math.abs(width * Math.sin(radian)) + Math.abs(height * Math.cos(radian));
    const HALF_LINE_LENGTH = lineLength / 2;

    const x0 = HALF_WIDTH + Math.sin(radian) * HALF_LINE_LENGTH;
    const y0 = HALF_HEIGHT - Math.cos(radian) * HALF_LINE_LENGTH;
    const x1 = width - x0;
    const y1 = height - y0;

    return {x0, x1, y0, y1};
};

const parseTopRight = (bounds: Bounds) =>
    Math.acos(
        bounds.width / 2 / (Math.sqrt(Math.pow(bounds.width, 2) + Math.pow(bounds.height, 2)) / 2)
    );

const parseSideOrCorner = (side: string, bounds: Bounds): Direction => {
    switch (side) {
        case 'bottom':
        case 'to top':
            return calculateGradientDirection(0, bounds);
        case 'left':
        case 'to right':
            return calculateGradientDirection(Math.PI / 2, bounds);
        case 'right':
        case 'to left':
            return calculateGradientDirection(3 * Math.PI / 2, bounds);
        case 'top right':
        case 'right top':
        case 'to bottom left':
        case 'to left bottom':
            return calculateGradientDirection(Math.PI + parseTopRight(bounds), bounds);
        case 'top left':
        case 'left top':
        case 'to bottom right':
        case 'to right bottom':
            return calculateGradientDirection(Math.PI - parseTopRight(bounds), bounds);
        case 'bottom left':
        case 'left bottom':
        case 'to top right':
        case 'to right top':
            return calculateGradientDirection(parseTopRight(bounds), bounds);
        case 'bottom right':
        case 'right bottom':
        case 'to top left':
        case 'to left top':
            return calculateGradientDirection(2 * Math.PI - parseTopRight(bounds), bounds);
        case 'top':
        case 'to bottom':
        default:
            return calculateGradientDirection(Math.PI, bounds);
    }
};

const parsePercentageAngle = (angle: string, bounds: Bounds): Direction => {
    const [left, top] = angle.split(' ').map(parseFloat);
    const ratio = left / 100 * bounds.width / (top / 100 * bounds.height);

    return calculateGradientDirection(Math.atan(isNaN(ratio) ? 1 : ratio) + Math.PI / 2, bounds);
};
