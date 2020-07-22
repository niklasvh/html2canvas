import {IPropertyTypeValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';

export const duration: IPropertyTypeValueDescriptor = {
    name: 'duration',
    initialValue: '0s',
    prefix: false,
    type: PropertyDescriptorParsingType.TYPE_VALUE,
    format: 'duration'
};
