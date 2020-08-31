import {IPropertyTypeValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';

export const textStrokeColor: IPropertyTypeValueDescriptor = {
    name: `text-stroke-color`,
    initialValue: 'transparent',
    prefix: true,
    type: PropertyDescriptorParsingType.TYPE_VALUE,
    format: 'color'
};
