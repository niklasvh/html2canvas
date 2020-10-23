import {IPropertyIdentValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
const enum OBJECT_FIT {
    COVER = 'cover',
    CONTAIN = 'contain',
    FILL = 'fill',
    SCALE_DOWN = 'scale_down',
    NONE = 'none',
}

export const objectFit: IPropertyIdentValueDescriptor<OBJECT_FIT> = {
    name: 'object-fit',
    initialValue: 'fill',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (objectFit: string) => {
        switch (objectFit) {
            case 'contain':
                return OBJECT_FIT.CONTAIN;
            case 'cover':
                return OBJECT_FIT.COVER;
            case 'none':
                return OBJECT_FIT.NONE;
            case 'scale-down':
                return OBJECT_FIT.SCALE_DOWN;
            case 'fill':
                return OBJECT_FIT.FILL;
            default:
                return OBJECT_FIT.FILL;
        }
    }
};