import {PropertyDescriptorParsingType, IPropertyListDescriptor} from "../IPropertyDescriptor";
import {CSSValue, isIdentWithValue, parseFunctionArgs} from "../syntax/parser";
import {
    isLengthPercentage, LengthPercentage, ZERO_LENGTH
} from "../types/length-percentage";
import {color, Color, COLORS} from "../types/color";

export type TextShadow = TextShadowItem[];
export type TextShadowItem = {
    color: Color
    offsetX: LengthPercentage
    offsetY: LengthPercentage
    blur: LengthPercentage
}

export const textShadow: IPropertyListDescriptor<TextShadow> = {
    name: 'text-shadow',
    initialValue: 'none',
    type: PropertyDescriptorParsingType.LIST,
    prefix: false,
    parse: (tokens: CSSValue[]): TextShadow => {
        if (tokens.length === 1 && isIdentWithValue(tokens[0], 'none')) {
            return [];
        }

        return parseFunctionArgs(tokens)
            .map((values: CSSValue[]) => {

                const shadow : TextShadowItem = {
                    color: COLORS.TRANSPARENT,
                    offsetX: ZERO_LENGTH,
                    offsetY: ZERO_LENGTH,
                    blur: ZERO_LENGTH
                };
                let c = 0;
                for (let i = 0; i < values.length; i++) {
                    const token = values[i];
                    if (isLengthPercentage(token)) {
                        if (c === 0) {
                            shadow.offsetX = token;
                        } else if (c === 1) {
                            shadow.offsetY = token;
                        } else {
                            shadow.blur = token;
                        }
                        c++
                    } else {
                        shadow.color = color.parse(token);
                    }
                }
                return shadow;
            });
    }
};