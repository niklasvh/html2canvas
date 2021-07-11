import {IPropertyListDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue, isIdentToken} from '../syntax/parser';
export const fontVariant: IPropertyListDescriptor<string[]> = {
    name: 'font-variant',
    initialValue: 'none',
    type: PropertyDescriptorParsingType.LIST,
    prefix: false,
    parse: (tokens: CSSValue[]): string[] => {
        return tokens.filter(isIdentToken).map((token) => token.value);
    }
};
