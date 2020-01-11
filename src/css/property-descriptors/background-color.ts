import {IPropertyTypeValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';

export const backgroundColor: IPropertyTypeValueDescriptor = {
    name: `background-color`,
    initialValue: 'transparent',
    prefix: false,
    type: PropertyDescriptorParsingType.TYPE_VALUE,
    format: 'color'
};
