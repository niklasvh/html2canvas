import {IPropertyListDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue, isIdentToken} from '../syntax/parser';
export enum OVERFLOW {
    VISIBLE = 0,
    HIDDEN = 1,
    SCROLL = 2,
    AUTO = 3
}

export const overflow: IPropertyListDescriptor<OVERFLOW[]> = {
    name: 'overflow',
    initialValue: 'visible',
    prefix: false,
    type: PropertyDescriptorParsingType.LIST,
    parse: (tokens: CSSValue[]): OVERFLOW[] => {
        return tokens.filter(isIdentToken).map((overflow) => {
            switch (overflow.value) {
                case 'hidden':
                    return OVERFLOW.HIDDEN;
                case 'scroll':
                    return OVERFLOW.SCROLL;
                case 'auto':
                    return OVERFLOW.AUTO;
                case 'visible':
                default:
                    return OVERFLOW.VISIBLE;
            }
        });
    }
};
