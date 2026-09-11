import {IPropertyListDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue} from '../syntax/parser';
import {TokenType} from '../syntax/tokenizer';
import {Context} from '../../core/context';

export type FONT_FAMILY = string;

export type FontFamily = FONT_FAMILY[];

export const fontFamily: IPropertyListDescriptor<FontFamily> = {
    name: `font-family`,
    initialValue: '',
    prefix: false,
    type: PropertyDescriptorParsingType.LIST,
    parse: (_context: Context, tokens: CSSValue[]) => {
        const accumulator: string[] = [];
        const results: string[] = [];
        const quoted: boolean[] = [];
        let isQuoted = false;
        tokens.forEach((token) => {
            switch (token.type) {
                case TokenType.IDENT_TOKEN:
                    accumulator.push(token.value);
                    break;
                case TokenType.STRING_TOKEN:
                    isQuoted = true;
                    accumulator.push(token.value);
                    break;
                case TokenType.NUMBER_TOKEN:
                    accumulator.push(token.number.toString());
                    break;
                case TokenType.COMMA_TOKEN:
                    results.push(accumulator.join(' '));
                    quoted.push(isQuoted);
                    isQuoted = false;
                    accumulator.length = 0;
                    break;
            }
        });
        if (accumulator.length) {
            results.push(accumulator.join(' '));
            quoted.push(isQuoted);
        }
        return results.map((result, index) =>
            quoted[index] || result.indexOf(' ') !== -1
                ? `'${result
                      .replace(/\\/g, '\\\\')
                      .replace(/'/g, "\\'")
                      .replace(/\n/g, '\\a ')
                      .replace(/\r/g, '\\d ')
                      .replace(/\f/g, '\\c ')}'`
                : result
        );
    }
};
