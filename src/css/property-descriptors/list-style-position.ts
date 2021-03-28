import {IPropertyIdentValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
export enum LIST_STYLE_POSITION {
    INSIDE = 0,
    OUTSIDE = 1
}

export const listStylePosition: IPropertyIdentValueDescriptor<LIST_STYLE_POSITION> = {
    name: 'list-style-position',
    initialValue: 'outside',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (position: string) => {
        switch (position) {
            case 'inside':
                return LIST_STYLE_POSITION.INSIDE;
            case 'outside':
            default:
                return LIST_STYLE_POSITION.OUTSIDE;
        }
    }
};
