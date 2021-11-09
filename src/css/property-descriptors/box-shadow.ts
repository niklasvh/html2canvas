import {PropertyDescriptorParsingType, IPropertyListDescriptor} from '../IPropertyDescriptor';
import {CSSValue, isIdentWithValue, parseFunctionArgs} from '../syntax/parser';
import {ZERO_LENGTH} from '../types/length-percentage';
import {color, Color} from '../types/color';
import {isLength, Length} from '../types/length';
import {Context} from '../../core/context';

export type BoxShadow = BoxShadowItem[];
interface BoxShadowItem {
    inset: boolean;
    color: Color;
    offsetX: Length;
    offsetY: Length;
    blur: Length;
    spread: Length;
}

export const boxShadow: IPropertyListDescriptor<BoxShadow> = {
    name: 'box-shadow',
    initialValue: 'none',
    type: PropertyDescriptorParsingType.LIST,
    prefix: false,
    parse: (context: Context, tokens: CSSValue[]): BoxShadow => {
        if (tokens.length === 1 && isIdentWithValue(tokens[0], 'none')) {
            return [];
        }

        return parseFunctionArgs(tokens).map((values: CSSValue[]) => {
            const shadow: BoxShadowItem = {
                color: 0x000000ff,
                offsetX: ZERO_LENGTH,
                offsetY: ZERO_LENGTH,
                blur: ZERO_LENGTH,
                spread: ZERO_LENGTH,
                inset: false
            };
            let c = 0;
            for (let i = 0; i < values.length; i++) {
                const token = values[i];
                if (isIdentWithValue(token, 'inset')) {
                    shadow.inset = true;
                } else if (isLength(token)) {
                    if (c === 0) {
                        shadow.offsetX = token;
                    } else if (c === 1) {
                        shadow.offsetY = token;
                    } else if (c === 2) {
                        shadow.blur = token;
                    } else {
                        shadow.spread = token;
                    }
                    c++;
                } else {
                    shadow.color = color.parse(context, token);
                }
            }
            return shadow;
        });
    }
};
