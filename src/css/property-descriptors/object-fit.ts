import {IPropertyIdentValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {Context} from '../../core/context';
export const enum OBJECT_FIT {
    FILL = 'fill',
    CONTAIN = 'contain',
    COVER = 'cover',
    NONE = 'none',
    SCALE_DOWN = 'scale-down'
}

export const objectFit: IPropertyIdentValueDescriptor<OBJECT_FIT> = {
    name: 'object-fit',
    initialValue: 'fill',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (_context: Context, objectFit: string) => {
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
            default:
                return OBJECT_FIT.FILL;
        }
    }
};
