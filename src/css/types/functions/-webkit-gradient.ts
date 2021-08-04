import {CSSValue, isIdentToken, isNumberToken, nonFunctionArgSeparator, parseFunctionArgs} from '../../syntax/parser';
import {
    CSSImageType,
    CSSLinearGradientImage,
    CSSRadialExtent,
    CSSRadialGradientImage,
    CSSRadialShape,
    CSSRadialSize,
    UnprocessedGradientColorStop
} from '../image';
import {deg} from '../angle';
import {TokenType} from '../../syntax/tokenizer';
import {color as colorType} from '../color';
import {HUNDRED_PERCENT, LengthPercentage, ZERO_LENGTH} from '../length-percentage';
import {Context} from '../../../core/context';

export const webkitGradient = (
    context: Context,
    tokens: CSSValue[]
): CSSLinearGradientImage | CSSRadialGradientImage => {
    const angle = deg(180);
    const stops: UnprocessedGradientColorStop[] = [];
    let type = CSSImageType.LINEAR_GRADIENT;
    const shape: CSSRadialShape = CSSRadialShape.CIRCLE;
    const size: CSSRadialSize = CSSRadialExtent.FARTHEST_CORNER;
    const position: LengthPercentage[] = [];
    parseFunctionArgs(tokens).forEach((arg, i) => {
        const firstToken = arg[0];
        if (i === 0) {
            if (isIdentToken(firstToken) && firstToken.value === 'linear') {
                type = CSSImageType.LINEAR_GRADIENT;
                return;
            } else if (isIdentToken(firstToken) && firstToken.value === 'radial') {
                type = CSSImageType.RADIAL_GRADIENT;
                return;
            }
        }

        if (firstToken.type === TokenType.FUNCTION) {
            if (firstToken.name === 'from') {
                const color = colorType.parse(context, firstToken.values[0]);
                stops.push({stop: ZERO_LENGTH, color});
            } else if (firstToken.name === 'to') {
                const color = colorType.parse(context, firstToken.values[0]);
                stops.push({stop: HUNDRED_PERCENT, color});
            } else if (firstToken.name === 'color-stop') {
                const values = firstToken.values.filter(nonFunctionArgSeparator);
                if (values.length === 2) {
                    const color = colorType.parse(context, values[1]);
                    const stop = values[0];
                    if (isNumberToken(stop)) {
                        stops.push({
                            stop: {type: TokenType.PERCENTAGE_TOKEN, number: stop.number * 100, flags: stop.flags},
                            color
                        });
                    }
                }
            }
        }
    });

    return type === CSSImageType.LINEAR_GRADIENT
        ? {
              angle: (angle + deg(180)) % deg(360),
              stops,
              type
          }
        : {size, shape, stops, position, type};
};
