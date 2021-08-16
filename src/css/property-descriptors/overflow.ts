import {IPropertyListDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue, isIdentToken} from '../syntax/parser';
import {Context} from '../../core/context';
export const enum OVERFLOW {
    VISIBLE = 0,
    HIDDEN = 1,
    SCROLL = 2,
    CLIP = 3,
    AUTO = 4
}

export const overflow: IPropertyListDescriptor<OVERFLOW[]> = {
    name: 'overflow',
    initialValue: 'visible',
    prefix: false,
    type: PropertyDescriptorParsingType.LIST,
    parse: (_context: Context, tokens: CSSValue[]): OVERFLOW[] => {
        return tokens.filter(isIdentToken).map((overflow) => {
            switch (overflow.value) {
                case 'hidden':
                    return OVERFLOW.HIDDEN;
                case 'scroll':
                    return OVERFLOW.SCROLL;
                case 'clip':
                    return OVERFLOW.CLIP;
                case 'auto':
                    return OVERFLOW.AUTO;
                case 'visible':
                default:
                    return OVERFLOW.VISIBLE;
            }
        });
    }
};
