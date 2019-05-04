import {IPropertyIdentValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
export enum VISIBILITY {
    VISIBLE = 0,
    HIDDEN = 1,
    COLLAPSE = 2
}

export const visibility: IPropertyIdentValueDescriptor<VISIBILITY> = {
    name: 'visible',
    initialValue: 'none',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (visibility: string) => {
        switch (visibility) {
            case 'hidden':
                return VISIBILITY.HIDDEN;
            case 'collapse':
                return VISIBILITY.COLLAPSE;
            case 'visible':
            default:
                return VISIBILITY.VISIBLE;
        }
    }
};
