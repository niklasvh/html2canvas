import {IPropertyIdentValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';

export const enum DIRECTION {
    RTL = 0,
    LTR = 1,
    INHERIT = 2
}

export const direction: IPropertyIdentValueDescriptor<DIRECTION> = {
    name: 'direction',
    initialValue: 'inherit',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (direction: string) => {
        switch (direction) {
            case 'rtl':
                return DIRECTION.RTL;
            case 'ltr':
                return DIRECTION.LTR;
            case 'inherit':
                return DIRECTION.INHERIT;
        }
        return DIRECTION.INHERIT;
    }
};
