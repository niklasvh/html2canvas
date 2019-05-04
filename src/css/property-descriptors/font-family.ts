import {IPropertyListDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue} from '../syntax/parser';
import {StringValueToken, TokenType} from '../syntax/tokenizer';

export type FONT_FAMILY = string;

export type FontFamily = FONT_FAMILY[];

export const fontFamily: IPropertyListDescriptor<FontFamily> = {
    name: `font-family`,
    initialValue: '',
    prefix: false,
    type: PropertyDescriptorParsingType.LIST,
    parse: (tokens: CSSValue[]) => {
        return tokens.filter(isStringToken).map(token => token.value);
    }
};

const isStringToken = (token: CSSValue): token is StringValueToken =>
    token.type === TokenType.STRING_TOKEN || token.type === TokenType.IDENT_TOKEN;
