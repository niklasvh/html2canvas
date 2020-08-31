import {IPropertyTypeValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
export const textStrokeWidth: IPropertyTypeValueDescriptor = {
    name: 'text-stroke-width',
    initialValue: '0',
    type: PropertyDescriptorParsingType.TYPE_VALUE,
    prefix: true,
    format: 'length-percentage'
};
