import {IPropertyListDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue, isStringToken} from '../syntax/parser';
import {TokenType} from '../syntax/tokenizer';
import {Context} from '../../core/context';

export interface QUOTE {
    open: string;
    close: string;
}

export type Quotes = QUOTE[] | null;

export const quotes: IPropertyListDescriptor<Quotes> = {
    name: 'quotes',
    initialValue: 'none',
    prefix: true,
    type: PropertyDescriptorParsingType.LIST,
    parse: (_context: Context, tokens: CSSValue[]) => {
        if (tokens.length === 0) {
            return null;
        }

        const first = tokens[0];

        if (first.type === TokenType.IDENT_TOKEN && first.value === 'none') {
            return null;
        }

        const quotes = [];
        const filtered = tokens.filter(isStringToken);

        if (filtered.length % 2 !== 0) {
            return null;
        }

        for (let i = 0; i < filtered.length; i += 2) {
            const open = filtered[i].value;
            const close = filtered[i + 1].value;
            quotes.push({open, close});
        }

        return quotes;
    }
};

export const getQuote = (quotes: Quotes, depth: number, open: boolean): string => {
    if (!quotes) {
        return '';
    }

    const quote = quotes[Math.min(depth, quotes.length - 1)];
    if (!quote) {
        return '';
    }

    return open ? quote.open : quote.close;
};
