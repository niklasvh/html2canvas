import {IPropertyListDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue} from '../syntax/parser';
import {TokenType} from '../syntax/tokenizer';

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
        tokens.forEach((token) => {
            switch (token.type) {
                case TokenType.IDENT_TOKEN:
                case TokenType.STRING_TOKEN:
                    accumulator.push(token.value);
                    break;
                case TokenType.NUMBER_TOKEN:
                    accumulator.push(token.number.toString());
                    break;
                case TokenType.COMMA_TOKEN:
                    results.push(accumulator.join(' '));
                    accumulator.length = 0;
                    break;
            }
        });
        if (accumulator.length) {
            results.push(accumulator.join(' '));
        }
        return results.map((result) => (result.indexOf(' ') === -1 ? result : `'${result}'`));
    }
};
