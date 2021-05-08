import {IPropertyTypeValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';

export const textFillColor: IPropertyTypeValueDescriptor = {
    name: `text-fill-color`,
    initialValue: 'transparent',
    prefix: true,
    type: PropertyDescriptorParsingType.TYPE_VALUE,
    format: 'color'
};
