import {IPropertyIdentValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {Context} from '../../core/context';

export const enum DIRECTION {
    LTR = 0,
    RTL = 1
}

export const direction: IPropertyIdentValueDescriptor<DIRECTION> = {
    name: 'direction',
    initialValue: 'ltr',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (_context: Context, direction: string) => {
        switch (direction) {
            case 'rtl':
                return DIRECTION.RTL;
            case 'ltr':
            default:
                return DIRECTION.LTR;
        }
    }
};
