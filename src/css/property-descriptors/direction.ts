import {IPropertyIdentValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
export enum DIRECTION {
    LTR = 0,
    RTL = 1
}

export const direction: IPropertyIdentValueDescriptor<DIRECTION> = {
    name: 'float',
    initialValue: 'none',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (float: string) => {
        switch (float) {
            case 'ltr':
                return DIRECTION.LTR;
            case 'rtl':
                return DIRECTION.RTL;
        }
        return DIRECTION.RTL;
    }
};
