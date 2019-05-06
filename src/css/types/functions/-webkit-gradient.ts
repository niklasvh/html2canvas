import {CSSValue, isIdentToken, isNumberToken, nonFunctionArgSeperator, parseFunctionArgs} from '../../syntax/parser';
import {CSSImageType, CSSLinearGradientImage, UnprocessedGradientColorStop} from '../image';
import {deg} from '../angle';
import {TokenType} from '../../syntax/tokenizer';
import {color as colorType} from '../color';
import {HUNDRED_PERCENT, ZERO_LENGTH} from '../length-percentage';

export const webkitGradient = (tokens: CSSValue[]): CSSLinearGradientImage => {
    let angle = deg(180);
    const stops: UnprocessedGradientColorStop[] = [];
    let type = CSSImageType.LINEAR_GRADIENT;
    parseFunctionArgs(tokens).forEach((arg, i) => {
        const firstToken = arg[0];
        if (i === 0) {
            if (isIdentToken(firstToken) && firstToken.value === 'linear') {
                type = CSSImageType.LINEAR_GRADIENT;
                return;
            }
        }

        if (firstToken.type === TokenType.FUNCTION) {
            if (firstToken.name === 'from') {
                const color = colorType.parse(firstToken.values[0]);
                stops.push({stop: ZERO_LENGTH, color});
            } else if (firstToken.name === 'to') {
                const color = colorType.parse(firstToken.values[0]);
                stops.push({stop: HUNDRED_PERCENT, color});
            } else if (firstToken.name === 'color-stop') {
                const values = firstToken.values.filter(nonFunctionArgSeperator);
                if (values.length === 2) {
                    const color = colorType.parse(values[1]);
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

    return {
        angle: (angle + deg(180)) % deg(360),
        stops,
        type
    };
};
