import {IPropertyValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue} from '../syntax/parser';
import {TokenType} from '../syntax/tokenizer';
export const letterSpacing: IPropertyValueDescriptor<number> = {
    name: 'letter-spacing',
    initialValue: '0',
    prefix: false,
    type: PropertyDescriptorParsingType.VALUE,
    parse: (token: CSSValue) => {
        if (token.type === TokenType.IDENT_TOKEN && token.value === 'normal') {
            return 0;
        }

        if (token.type === TokenType.NUMBER_TOKEN) {
            return token.number;
        }

        if (token.type === TokenType.DIMENSION_TOKEN) {
            return token.number;
        }

        return 0;
    }
};
