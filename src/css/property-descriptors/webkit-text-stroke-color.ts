import {IPropertyTypeValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
export const webkitTextStrokeColor: IPropertyTypeValueDescriptor = {
    name: `-webkit-text-stroke-color`,
    initialValue: 'currentcolor',
    prefix: false,
    type: PropertyDescriptorParsingType.TYPE_VALUE,
    format: 'color'
};
