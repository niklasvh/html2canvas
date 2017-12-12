/* @flow */
'use strict';

import type {BackgroundSource} from './parsing/background';
import type {Bounds} from './Bounds';
import NodeContainer from './NodeContainer';
import {parseAngle} from './Angle';
import Color from './Color';
import Length, {LENGTH_TYPE, calculateLengthFromValueWithUnit} from './Length';
import {distance} from './Util';

const SIDE_OR_CORNER = /^(to )?(left|top|right|bottom)( (left|top|right|bottom))?$/i;
const PERCENTAGE_ANGLES = /^([+-]?\d*\.?\d+)% ([+-]?\d*\.?\d+)%$/i;
const ENDS_WITH_LENGTH = /(px)|%|( 0)$/i;
const FROM_TO_COLORSTOP = /^(from|to|color-stop)\((?:([\d.]+)(%)?,\s*)?(.+?)\)$/i;
const RADIAL_SHAPE_DEFINITION = /^\s*(circle|ellipse)?\s*((?:([\d.]+)(px|r?em|%)\s*(?:([\d.]+)(px|r?em|%))?)|closest-side|closest-corner|farthest-side|farthest-corner)?\s*(?:at\s*(?:(left|center|right)|([\d.]+)(px|r?em|%))\s+(?:(top|center|bottom)|([\d.]+)(px|r?em|%)))?(?:\s|$)/i;

export type Point = {
    x: number,
    y: number
};

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

export interface Gradient {
    type: GradientType,
    colorStops: Array<ColorStop>
}

export const GRADIENT_TYPE = {
    LINEAR_GRADIENT: 0,
    RADIAL_GRADIENT: 1
};

export type GradientType = $Values<typeof GRADIENT_TYPE>;

export const RADIAL_GRADIENT_SHAPE = {
    CIRCLE: 0,
    ELLIPSE: 1
};

export type RadialGradientShapeType = $Values<typeof RADIAL_GRADIENT_SHAPE>;

const LENGTH_FOR_POSITION = {
    left: new Length('0%'),
    top: new Length('0%'),
    center: new Length('50%'),
    right: new Length('100%'),
    bottom: new Length('100%')
};

export class LinearGradient implements Gradient {
    type: GradientType;
    colorStops: Array<ColorStop>;
    direction: Direction;

    constructor(colorStops: Array<ColorStop>, direction: Direction) {
        this.type = GRADIENT_TYPE.LINEAR_GRADIENT;
        this.colorStops = colorStops;
        this.direction = direction;
    }
}

export class RadialGradient implements Gradient {
    type: GradientType;
    colorStops: Array<ColorStop>;
    shape: RadialGradientShapeType;
    center: Point;
    radius: Point;

    constructor(
        colorStops: Array<ColorStop>,
        shape: RadialGradientShapeType,
        center: Point,
        radius: Point
    ) {
        this.type = GRADIENT_TYPE.RADIAL_GRADIENT;
        this.colorStops = colorStops;
        this.shape = shape;
        this.center = center;
        this.radius = radius;
    }
}

export const parseGradient = (
    container: NodeContainer,
    {args, method, prefix}: BackgroundSource,
    bounds: Bounds
): ?Gradient => {
    if (method === 'linear-gradient') {
        return parseLinearGradient(args, bounds, !!prefix);
    } else if (method === 'gradient' && args[0] === 'linear') {
        // TODO handle correct angle
        return parseLinearGradient(
            ['to bottom'].concat(transformObsoleteColorStops(args.slice(3))),
            bounds,
            !!prefix
        );
    } else if (method === 'radial-gradient') {
        return parseRadialGradient(
            container,
            prefix === '-webkit-' ? transformWebkitRadialGradientArgs(args) : args,
            bounds
        );
    } else if (method === 'gradient' && args[0] === 'radial') {
        return parseRadialGradient(
            container,
            transformObsoleteColorStops(transformWebkitRadialGradientArgs(args.slice(1))),
            bounds
        );
    }
};

const parseColorStops = (args: Array<string>, firstColorStopIndex: number, lineLength: number) => {
    const colorStops = [];

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

    const absoluteValuedColorStops = colorStops.map(({color, stop}) => {
        const absoluteStop =
            lineLength === 0 ? 0 : stop ? stop.getAbsoluteValue(lineLength) / lineLength : null;

        return {
            color,
            // $FlowFixMe
            stop: absoluteStop
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

    return absoluteValuedColorStops;
};

const parseLinearGradient = (
    args: Array<string>,
    bounds: Bounds,
    hasPrefix: boolean
): LinearGradient => {
    const angle = parseAngle(args[0]);
    const HAS_SIDE_OR_CORNER = SIDE_OR_CORNER.test(args[0]);
    const HAS_DIRECTION = HAS_SIDE_OR_CORNER || angle !== null || PERCENTAGE_ANGLES.test(args[0]);
    const direction = HAS_DIRECTION
        ? angle !== null
          ? calculateGradientDirection(
                // if there is a prefix, the 0° angle points due East (instead of North per W3C)
                hasPrefix ? angle - Math.PI * 0.5 : angle,
                bounds
            )
          : HAS_SIDE_OR_CORNER
            ? parseSideOrCorner(args[0], bounds)
            : parsePercentageAngle(args[0], bounds)
        : calculateGradientDirection(Math.PI, bounds);
    const firstColorStopIndex = HAS_DIRECTION ? 1 : 0;

    // TODO: Fix some inaccuracy with color stops with px values
    const lineLength = Math.min(
        distance(
            Math.abs(direction.x0) + Math.abs(direction.x1),
            Math.abs(direction.y0) + Math.abs(direction.y1)
        ),
        bounds.width * 2,
        bounds.height * 2
    );

    return new LinearGradient(parseColorStops(args, firstColorStopIndex, lineLength), direction);
};

const parseRadialGradient = (
    container: NodeContainer,
    args: Array<string>,
    bounds: Bounds
): RadialGradient => {
    const m = args[0].match(RADIAL_SHAPE_DEFINITION);
    const shape =
        m &&
        (m[1] === 'circle' || // explicit shape specification
            (m[3] !== undefined && m[5] === undefined)) // only one radius coordinate
            ? RADIAL_GRADIENT_SHAPE.CIRCLE
            : RADIAL_GRADIENT_SHAPE.ELLIPSE;
    const radius = {};
    const center = {};

    if (m) {
        // Radius
        if (m[3] !== undefined) {
            radius.x = calculateLengthFromValueWithUnit(container, m[3], m[4]).getAbsoluteValue(
                bounds.width
            );
        }

        if (m[5] !== undefined) {
            radius.y = calculateLengthFromValueWithUnit(container, m[5], m[6]).getAbsoluteValue(
                bounds.height
            );
        }

        // Position
        if (m[7]) {
            center.x = LENGTH_FOR_POSITION[m[7].toLowerCase()];
        } else if (m[8] !== undefined) {
            center.x = calculateLengthFromValueWithUnit(container, m[8], m[9]);
        }

        if (m[10]) {
            center.y = LENGTH_FOR_POSITION[m[10].toLowerCase()];
        } else if (m[11] !== undefined) {
            center.y = calculateLengthFromValueWithUnit(container, m[11], m[12]);
        }
    }

    const gradientCenter = {
        x: center.x === undefined ? bounds.width / 2 : center.x.getAbsoluteValue(bounds.width),
        y: center.y === undefined ? bounds.height / 2 : center.y.getAbsoluteValue(bounds.height)
    };
    const gradientRadius = calculateRadius(
        (m && m[2]) || 'farthest-corner',
        shape,
        gradientCenter,
        radius,
        bounds
    );

    return new RadialGradient(
        parseColorStops(args, m ? 1 : 0, Math.min(gradientRadius.x, gradientRadius.y)),
        shape,
        gradientCenter,
        gradientRadius
    );
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
    Math.acos(bounds.width / 2 / (distance(bounds.width, bounds.height) / 2));

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

const findCorner = (bounds: Bounds, x: number, y: number, closest: boolean): Point => {
    var corners = [
        {x: 0, y: 0},
        {x: 0, y: bounds.height},
        {x: bounds.width, y: 0},
        {x: bounds.width, y: bounds.height}
    ];

    // $FlowFixMe
    return corners.reduce(
        (stat, corner) => {
            const d = distance(x - corner.x, y - corner.y);
            if (closest ? d < stat.optimumDistance : d > stat.optimumDistance) {
                return {
                    optimumCorner: corner,
                    optimumDistance: d
                };
            }

            return stat;
        },
        {
            optimumDistance: closest ? Infinity : -Infinity,
            optimumCorner: null
        }
    ).optimumCorner;
};

const calculateRadius = (
    extent: string,
    shape: RadialGradientShapeType,
    center: Point,
    radius: Point,
    bounds: Bounds
): Point => {
    const x = center.x;
    const y = center.y;
    let rx = 0;
    let ry = 0;

    switch (extent) {
        case 'closest-side':
            // The ending shape is sized so that that it exactly meets the side of the gradient box closest to the gradient’s center.
            // If the shape is an ellipse, it exactly meets the closest side in each dimension.
            if (shape === RADIAL_GRADIENT_SHAPE.CIRCLE) {
                rx = ry = Math.min(
                    Math.abs(x),
                    Math.abs(x - bounds.width),
                    Math.abs(y),
                    Math.abs(y - bounds.height)
                );
            } else if (shape === RADIAL_GRADIENT_SHAPE.ELLIPSE) {
                rx = Math.min(Math.abs(x), Math.abs(x - bounds.width));
                ry = Math.min(Math.abs(y), Math.abs(y - bounds.height));
            }
            break;

        case 'closest-corner':
            // The ending shape is sized so that that it passes through the corner of the gradient box closest to the gradient’s center.
            // If the shape is an ellipse, the ending shape is given the same aspect-ratio it would have if closest-side were specified.
            if (shape === RADIAL_GRADIENT_SHAPE.CIRCLE) {
                rx = ry = Math.min(
                    distance(x, y),
                    distance(x, y - bounds.height),
                    distance(x - bounds.width, y),
                    distance(x - bounds.width, y - bounds.height)
                );
            } else if (shape === RADIAL_GRADIENT_SHAPE.ELLIPSE) {
                // Compute the ratio ry/rx (which is to be the same as for "closest-side")
                const c =
                    Math.min(Math.abs(y), Math.abs(y - bounds.height)) /
                    Math.min(Math.abs(x), Math.abs(x - bounds.width));
                const corner = findCorner(bounds, x, y, true);
                rx = distance(corner.x - x, (corner.y - y) / c);
                ry = c * rx;
            }
            break;

        case 'farthest-side':
            // Same as closest-side, except the ending shape is sized based on the farthest side(s)
            if (shape === RADIAL_GRADIENT_SHAPE.CIRCLE) {
                rx = ry = Math.max(
                    Math.abs(x),
                    Math.abs(x - bounds.width),
                    Math.abs(y),
                    Math.abs(y - bounds.height)
                );
            } else if (shape === RADIAL_GRADIENT_SHAPE.ELLIPSE) {
                rx = Math.max(Math.abs(x), Math.abs(x - bounds.width));
                ry = Math.max(Math.abs(y), Math.abs(y - bounds.height));
            }
            break;

        case 'farthest-corner':
            // Same as closest-corner, except the ending shape is sized based on the farthest corner.
            // If the shape is an ellipse, the ending shape is given the same aspect ratio it would have if farthest-side were specified.
            if (shape === RADIAL_GRADIENT_SHAPE.CIRCLE) {
                rx = ry = Math.max(
                    distance(x, y),
                    distance(x, y - bounds.height),
                    distance(x - bounds.width, y),
                    distance(x - bounds.width, y - bounds.height)
                );
            } else if (shape === RADIAL_GRADIENT_SHAPE.ELLIPSE) {
                // Compute the ratio ry/rx (which is to be the same as for "farthest-side")
                const c =
                    Math.max(Math.abs(y), Math.abs(y - bounds.height)) /
                    Math.max(Math.abs(x), Math.abs(x - bounds.width));
                const corner = findCorner(bounds, x, y, false);
                rx = distance(corner.x - x, (corner.y - y) / c);
                ry = c * rx;
            }
            break;

        default:
            // pixel or percentage values
            rx = radius.x || 0;
            ry = radius.y !== undefined ? radius.y : rx;
            break;
    }

    return {
        x: rx,
        y: ry
    };
};

export const transformWebkitRadialGradientArgs = (args: Array<string>): Array<string> => {
    let shape = '';
    let radius = '';
    let extent = '';
    let position = '';
    let idx = 0;

    const POSITION = /^(left|center|right|\d+(?:px|r?em|%)?)(?:\s+(top|center|bottom|\d+(?:px|r?em|%)?))?$/i;
    const SHAPE_AND_EXTENT = /^(circle|ellipse)?\s*(closest-side|closest-corner|farthest-side|farthest-corner|contain|cover)?$/i;
    const RADIUS = /^\d+(px|r?em|%)?(?:\s+\d+(px|r?em|%)?)?$/i;

    const matchStartPosition = args[idx].match(POSITION);
    if (matchStartPosition) {
        idx++;
    }

    const matchShapeExtent = args[idx].match(SHAPE_AND_EXTENT);
    if (matchShapeExtent) {
        shape = matchShapeExtent[1] || '';
        extent = matchShapeExtent[2] || '';
        if (extent === 'contain') {
            extent = 'closest-side';
        } else if (extent === 'cover') {
            extent = 'farthest-corner';
        }
        idx++;
    }

    const matchStartRadius = args[idx].match(RADIUS);
    if (matchStartRadius) {
        idx++;
    }

    const matchEndPosition = args[idx].match(POSITION);
    if (matchEndPosition) {
        idx++;
    }

    const matchEndRadius = args[idx].match(RADIUS);
    if (matchEndRadius) {
        idx++;
    }

    const matchPosition = matchEndPosition || matchStartPosition;
    if (matchPosition && matchPosition[1]) {
        position = matchPosition[1] + (/^\d+$/.test(matchPosition[1]) ? 'px' : '');
        if (matchPosition[2]) {
            position += ' ' + matchPosition[2] + (/^\d+$/.test(matchPosition[2]) ? 'px' : '');
        }
    }

    const matchRadius = matchEndRadius || matchStartRadius;
    if (matchRadius) {
        radius = matchRadius[0];
        if (!matchRadius[1]) {
            radius += 'px';
        }
    }

    if (position && !shape && !radius && !extent) {
        radius = position;
        position = '';
    }

    if (position) {
        position = `at ${position}`;
    }

    return [[shape, extent, radius, position].filter(s => !!s).join(' ')].concat(args.slice(idx));
};

const transformObsoleteColorStops = (args: Array<string>): Array<string> => {
    return (
        args
            .map(color => color.match(FROM_TO_COLORSTOP))
            // $FlowFixMe
            .map((v: Array<string>, index: number) => {
                if (!v) {
                    return args[index];
                }

                switch (v[1]) {
                    case 'from':
                        return `${v[4]} 0%`;
                    case 'to':
                        return `${v[4]} 100%`;
                    case 'color-stop':
                        if (v[3] === '%') {
                            return `${v[4]} ${v[2]}`;
                        }
                        return `${v[4]} ${parseFloat(v[2]) * 100}%`;
                }
            })
    );
};
