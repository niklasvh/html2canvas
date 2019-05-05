import {CSSValue} from '../../syntax/parser';
import {UnprocessedGradientColorStop} from '../image';
import {color as colorType} from '../color';
import {isLengthPercentage} from '../length-percentage';

export const parseColorStop = (args: CSSValue[]): UnprocessedGradientColorStop => {
    const color = colorType.parse(args[0]);
    const stop = args[1];
    return stop && isLengthPercentage(stop) ? {color, stop} : {color, stop: null};
};
