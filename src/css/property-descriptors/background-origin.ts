import {IPropertyListDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue, isIdentToken} from '../syntax/parser';
import {Context} from '../../core/context';

export const enum BACKGROUND_ORIGIN {
    BORDER_BOX = 0,
    PADDING_BOX = 1,
    CONTENT_BOX = 2
}

export type BackgroundOrigin = BACKGROUND_ORIGIN[];

export const backgroundOrigin: IPropertyListDescriptor<BackgroundOrigin> = {
    name: 'background-origin',
    initialValue: 'border-box',
    prefix: false,
    type: PropertyDescriptorParsingType.LIST,
    parse: (_context: Context, tokens: CSSValue[]): BackgroundOrigin => {
        return tokens.map((token) => {
            if (isIdentToken(token)) {
                switch (token.value) {
                    case 'padding-box':
                        return BACKGROUND_ORIGIN.PADDING_BOX;
                    case 'content-box':
                        return BACKGROUND_ORIGIN.CONTENT_BOX;
                }
            }
            return BACKGROUND_ORIGIN.BORDER_BOX;
        });
    }
};
