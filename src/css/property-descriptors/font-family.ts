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
        const accumulator: string[] = [];
        const results: string[] = [];
        tokens.forEach(token => {
          if (isStringToken(token)) {
            accumulator.push(token.value);
          }
          if (token.type === TokenType.COMMA_TOKEN) {
            results.push(`'${accumulator.join(' ')}'`);
            accumulator.length = 0;
          }
        });
        if (accumulator.length) {
          results.push(`'${accumulator.join(' ')}'`);
        }
        console.log(results);
        return results;
    }
};

const isStringToken = (token: CSSValue): token is StringValueToken =>
    token.type === TokenType.STRING_TOKEN || token.type === TokenType.IDENT_TOKEN;
