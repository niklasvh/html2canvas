import {IPropertyTypeValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';

export const fontSize: IPropertyTypeValueDescriptor = {
    name: `font-size`,
    initialValue: '0',
    prefix: false,
    type: PropertyDescriptorParsingType.TYPE_VALUE,
    format: 'length'
};
