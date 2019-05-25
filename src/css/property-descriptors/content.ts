import {TokenType} from '../syntax/tokenizer';
import {IPropertyListDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue} from '../syntax/parser';

export type Content = CSSValue[];

export const content: IPropertyListDescriptor<Content> = {
    name: 'content',
    initialValue: 'none',
    type: PropertyDescriptorParsingType.LIST,
    prefix: false,
    parse: (tokens: CSSValue[]) => {
        if (tokens.length === 0) {
            return [];
        }

        const first = tokens[0];

        if (first.type === TokenType.IDENT_TOKEN && first.value === 'none') {
            return [];
        }

        return tokens;
    }
};
