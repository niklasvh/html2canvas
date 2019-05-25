import {IPropertyTypeValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';

export const color: IPropertyTypeValueDescriptor = {
    name: `color`,
    initialValue: 'transparent',
    prefix: false,
    type: PropertyDescriptorParsingType.TYPE_VALUE,
    format: 'color'
};
