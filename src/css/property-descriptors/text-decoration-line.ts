import {IPropertyListDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue, isIdentToken} from '../syntax/parser';
import {Context} from '../../core/context';

export const enum TEXT_DECORATION_LINE {
    NONE = 0,
    UNDERLINE = 1,
    OVERLINE = 2,
    LINE_THROUGH = 3,
    BLINK = 4
}

export type TextDecorationLine = TEXT_DECORATION_LINE[];

export const textDecorationLine: IPropertyListDescriptor<TextDecorationLine> = {
    name: 'text-decoration-line',
    initialValue: 'none',
    prefix: false,
    type: PropertyDescriptorParsingType.LIST,
    parse: (_context: Context, tokens: CSSValue[]): TextDecorationLine => {
        return tokens
            .filter(isIdentToken)
            .map((token) => {
                switch (token.value) {
                    case 'underline':
                        return TEXT_DECORATION_LINE.UNDERLINE;
                    case 'overline':
                        return TEXT_DECORATION_LINE.OVERLINE;
                    case 'line-through':
                        return TEXT_DECORATION_LINE.LINE_THROUGH;
                    case 'none':
                        return TEXT_DECORATION_LINE.BLINK;
                }
                return TEXT_DECORATION_LINE.NONE;
            })
            .filter((line) => line !== TEXT_DECORATION_LINE.NONE);
    }
};
