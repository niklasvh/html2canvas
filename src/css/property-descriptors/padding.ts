import {IPropertyTypeValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';

const paddingForSide = (side: string): IPropertyTypeValueDescriptor => ({
    name: `padding-${side}`,
    initialValue: '0',
    prefix: false,
    type: PropertyDescriptorParsingType.TYPE_VALUE,
    format: 'length-percentage'
});

export const paddingTop: IPropertyTypeValueDescriptor = paddingForSide('top');
export const paddingRight: IPropertyTypeValueDescriptor = paddingForSide('right');
export const paddingBottom: IPropertyTypeValueDescriptor = paddingForSide('bottom');
export const paddingLeft: IPropertyTypeValueDescriptor = paddingForSide('left');
