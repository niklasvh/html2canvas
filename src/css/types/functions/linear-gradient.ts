import {CSSValue, parseFunctionArgs} from '../../syntax/parser';
import {TokenType} from '../../syntax/tokenizer';
import {isAngle, angle as angleType, parseNamedSide, deg} from '../angle';
import {CSSImageType, CSSLinearGradientImage, GradientCorner, UnprocessedGradientColorStop} from '../image';
import {parseColorStop} from './gradient';
import {Context} from '../../../core/context';

export const linearGradient = (context: Context, tokens: CSSValue[]): CSSLinearGradientImage => {
    let angle: number | GradientCorner = deg(180);
    const stops: UnprocessedGradientColorStop[] = [];

    parseFunctionArgs(tokens).forEach((arg, i) => {
        if (i === 0) {
            const firstToken = arg[0];
            if (firstToken.type === TokenType.IDENT_TOKEN && firstToken.value === 'to') {
                angle = parseNamedSide(arg);
                return;
            } else if (isAngle(firstToken)) {
                angle = angleType.parse(context, firstToken);
                return;
            }
        }
        const colorStop = parseColorStop(context, arg);
        stops.push(colorStop);
    });

    return {angle, stops, type: CSSImageType.LINEAR_GRADIENT};
};
