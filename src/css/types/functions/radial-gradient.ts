import {CSSValue, isIdentToken, parseFunctionArgs} from '../../syntax/parser';
import {
    CSSImageType,
    CSSRadialExtent,
    CSSRadialGradientImage,
    CSSRadialShape,
    CSSRadialSize,
    UnprocessedGradientColorStop
} from '../image';
import {parseColorStop} from './gradient';
import {FIFTY_PERCENT, HUNDRED_PERCENT, isLengthPercentage, LengthPercentage, ZERO_LENGTH} from '../length-percentage';
import {isLength} from '../length';
import {Context} from '../../../core/context';
export const CLOSEST_SIDE = 'closest-side';
export const FARTHEST_SIDE = 'farthest-side';
export const CLOSEST_CORNER = 'closest-corner';
export const FARTHEST_CORNER = 'farthest-corner';
export const CIRCLE = 'circle';
export const ELLIPSE = 'ellipse';
export const COVER = 'cover';
export const CONTAIN = 'contain';

export const radialGradient = (context: Context, tokens: CSSValue[]): CSSRadialGradientImage => {
    let shape: CSSRadialShape = CSSRadialShape.CIRCLE;
    let size: CSSRadialSize = CSSRadialExtent.FARTHEST_CORNER;
    const stops: UnprocessedGradientColorStop[] = [];
    const position: LengthPercentage[] = [];
    parseFunctionArgs(tokens).forEach((arg, i) => {
        let isColorStop = true;
        if (i === 0) {
            let isAtPosition = false;
            isColorStop = arg.reduce((acc, token) => {
                if (isAtPosition) {
                    if (isIdentToken(token)) {
                        switch (token.value) {
                            case 'center':
                                position.push(FIFTY_PERCENT);
                                return acc;
                            case 'top':
                            case 'left':
                                position.push(ZERO_LENGTH);
                                return acc;
                            case 'right':
                            case 'bottom':
                                position.push(HUNDRED_PERCENT);
                                return acc;
                        }
                    } else if (isLengthPercentage(token) || isLength(token)) {
                        position.push(token);
                    }
                } else if (isIdentToken(token)) {
                    switch (token.value) {
                        case CIRCLE:
                            shape = CSSRadialShape.CIRCLE;
                            return false;
                        case ELLIPSE:
                            shape = CSSRadialShape.ELLIPSE;
                            return false;
                        case 'at':
                            isAtPosition = true;
                            return false;
                        case CLOSEST_SIDE:
                            size = CSSRadialExtent.CLOSEST_SIDE;
                            return false;
                        case COVER:
                        case FARTHEST_SIDE:
                            size = CSSRadialExtent.FARTHEST_SIDE;
                            return false;
                        case CONTAIN:
                        case CLOSEST_CORNER:
                            size = CSSRadialExtent.CLOSEST_CORNER;
                            return false;
                        case FARTHEST_CORNER:
                            size = CSSRadialExtent.FARTHEST_CORNER;
                            return false;
                    }
                } else if (isLength(token) || isLengthPercentage(token)) {
                    if (!Array.isArray(size)) {
                        size = [];
                    }
                    size.push(token);
                    return false;
                }
                return acc;
            }, isColorStop);
        }

        if (isColorStop) {
            const colorStop = parseColorStop(context, arg);
            stops.push(colorStop);
        }
    });

    return {size, shape, stops, position, type: CSSImageType.RADIAL_GRADIENT};
};
