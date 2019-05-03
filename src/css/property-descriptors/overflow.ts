import {IPropertyIdentValueDescriptor, PropertyDescriptorParsingType} from "../IPropertyDescriptor";
export enum OVERFLOW {
    VISIBLE = 0,
    HIDDEN = 1,
    SCROLL = 2,
    AUTO = 3
}

export const overflow: IPropertyIdentValueDescriptor<OVERFLOW> = {
    name: 'overflow',
    initialValue: 'visible',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (overflow: string) => {
        switch (overflow) {
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
    }
};
