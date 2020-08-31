import {IPropertyListDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue, isIdentWithValue, CSSFunction, isCSSFunction} from '../syntax/parser';
import {isLength, Length} from '../types/length';

export interface Filter {
    contrast: Length | null;
    'hue-rotate': Length | null;
    grayscale: Length | null;
    brightness: Length | null;
    blur: Length | null;
    invert: Length | null;
    saturate: Length | null;
    sepia: Length | null;
}

export const filter: IPropertyListDescriptor<Filter | null> = {
    name: 'filter',
    initialValue: 'none',
    prefix: true,
    type: PropertyDescriptorParsingType.LIST,
    parse: (tokens: CSSValue[]) => {
        if (tokens.length === 1 && isIdentWithValue(tokens[0], 'none')) {
            return null;
        }

        const filter: Filter = {
            contrast: null,
            'hue-rotate': null,
            grayscale: null,
            brightness: null,
            blur: null,
            invert: null,
            saturate: null,
            sepia: null
        };

        let hasFilter: boolean = false;

        tokens.filter(isCSSFunction).forEach((token: CSSFunction) => {
            switch (token.name) {
                case 'contrast':
                case 'hue-rotate':
                case 'grayscale':
                case 'brightness':
                case 'blur':
                case 'invert':
                case 'saturate':
                case 'sepia':
                    for (let index = 0; index < token.values.length; index++) {
                        const value: CSSValue = token.values[index];
                        if (isLength(value)) {
                            hasFilter = true;
                            filter[token.name] = value;
                        }
                    }
                    break;
                default:
                    break;
            }
        });

        if (hasFilter) {
            return filter;
        } else {
            return null;
        }
    }
};
