import {CSSValue} from '../../syntax/parser';
import {GradientColorStop, GradientCorner, UnprocessedGradientColorStop} from '../image';
import {color as colorType} from '../color';
import {getAbsoluteValue, HUNDRED_PERCENT, isLengthPercentage, ZERO_LENGTH} from '../length-percentage';

export const parseColorStop = (args: CSSValue[]): UnprocessedGradientColorStop => {
    const color = colorType.parse(args[0]);
    const stop = args[1];
    return stop && isLengthPercentage(stop) ? {color, stop} : {color, stop: null};
};

export const processColorStops = (stops: UnprocessedGradientColorStop[], lineLength: number): GradientColorStop[] => {
    const first = stops[0];
    const last = stops[stops.length - 1];
    if (first.stop === null) {
        first.stop = ZERO_LENGTH;
    }

    if (last.stop === null) {
        last.stop = HUNDRED_PERCENT;
    }

    const processStops: (number | null)[] = [];
    let previous = 0;
    for (let i = 0; i < stops.length; i++) {
        const stop = stops[i].stop;
        if (stop !== null) {
            const absoluteValue = getAbsoluteValue(stop, lineLength);
            if (absoluteValue > previous) {
                processStops.push(absoluteValue);
            } else {
                processStops.push(previous);
            }
            previous = absoluteValue;
        } else {
            processStops.push(null);
        }
    }

    let gapBegin = null;
    for (let i = 0; i < processStops.length; i++) {
        const stop = processStops[i];
        if (stop === null) {
            if (gapBegin === null) {
                gapBegin = i;
            }
        } else if (gapBegin !== null) {
            const gapLength = i - gapBegin;
            const beforeGap = processStops[gapBegin - 1] as number;
            const gapValue = (stop - beforeGap) / (gapLength + 1);
            for (let g = 1; g <= gapLength; g++) {
                processStops[gapBegin + g - 1] = gapValue * g;
            }
            gapBegin = null;
        }
    }

    return stops.map(({color}, i) => {
        return {color, stop: Math.max(Math.min(1, (processStops[i] as number) / lineLength), 0)};
    });
};

const getAngleFromCorner = (corner: GradientCorner, width: number, height: number): number => {
    const centerX = width / 2;
    const centerY = height / 2;
    const x = getAbsoluteValue(corner[0], width) - centerX;
    const y = centerY - getAbsoluteValue(corner[1], height);

    return (Math.atan2(y, x) + Math.PI * 2) % (Math.PI * 2);
};

export const calculateGradientDirection = (
    angle: number | GradientCorner,
    width: number,
    height: number
): [number, number, number, number, number] => {
    const radian = typeof angle === 'number' ? angle : getAngleFromCorner(angle, width, height);

    const lineLength = Math.abs(width * Math.sin(radian)) + Math.abs(height * Math.cos(radian));

    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const halfLineLength = lineLength / 2;

    const yDiff = Math.sin(radian - Math.PI / 2) * halfLineLength;
    const xDiff = Math.cos(radian - Math.PI / 2) * halfLineLength;

    return [lineLength, halfWidth - xDiff, halfWidth + xDiff, halfHeight - yDiff, halfHeight + yDiff];
};
