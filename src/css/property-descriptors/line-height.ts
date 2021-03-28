import {IPropertyTokenValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue, isIdentToken} from '../syntax/parser';
import {TokenType} from '../syntax/tokenizer';
import {getAbsoluteValue, isLengthPercentage} from '../types/length-percentage';
export const lineHeight: IPropertyTokenValueDescriptor = {
    name: 'line-height',
    initialValue: 'normal',
    prefix: false,
    type: PropertyDescriptorParsingType.TOKEN_VALUE
};

export const computeLineHeight = (token: CSSValue, fontSize: number): number => {
    if (isIdentToken(token) && token.value === 'normal') {
        return 1.2 * fontSize;
    } else if (token.type === TokenType.NUMBER_TOKEN) {
        return fontSize * token.number;
    } else if (isLengthPercentage(token)) {
        return getAbsoluteValue(token, fontSize);
    }

    return fontSize;
};
