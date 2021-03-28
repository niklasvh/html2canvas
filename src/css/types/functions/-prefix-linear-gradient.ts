import {CSSValue, parseFunctionArgs} from '../../syntax/parser';
import {CSSImageType, CSSLinearGradientImage, GradientCorner, UnprocessedGradientColorStop} from '../image';
import {TokenType} from '../../syntax/tokenizer';
import {isAngle, angle as angleType, parseNamedSide, deg} from '../angle';
import {parseColorStop} from './gradient';

export const prefixLinearGradient = (tokens: CSSValue[]): CSSLinearGradientImage => {
    let angle: number | GradientCorner = deg(180);
    const stops: UnprocessedGradientColorStop[] = [];

    parseFunctionArgs(tokens).forEach((arg, i) => {
        if (i === 0) {
            const firstToken = arg[0];
            if (
                firstToken.type === TokenType.IDENT_TOKEN &&
                ['top', 'left', 'right', 'bottom'].indexOf(firstToken.value) !== -1
            ) {
                angle = parseNamedSide(arg);
                return;
            } else if (isAngle(firstToken)) {
                angle = (angleType.parse(firstToken) + deg(270)) % deg(360);
                return;
            }
        }
        const colorStop = parseColorStop(arg);
        stops.push(colorStop);
    });

    return {
        angle,
        stops,
        type: CSSImageType.LINEAR_GRADIENT
    };
};
