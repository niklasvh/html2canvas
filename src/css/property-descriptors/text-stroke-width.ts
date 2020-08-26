import {IPropertyTypeValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
export const textStrokeWidth: IPropertyTypeValueDescriptor = {
    name: '-webkit-text-stroke-width',
    initialValue: '0',
    type: PropertyDescriptorParsingType.TYPE_VALUE,
    prefix: false,
    format: 'length-percentage'
};
