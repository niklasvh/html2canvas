import {IPropertyTypeValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
const borderColorForSide = (side: string): IPropertyTypeValueDescriptor => ({
    name: `border-${side}-color`,
    initialValue: 'transparent',
    prefix: false,
    type: PropertyDescriptorParsingType.TYPE_VALUE,
    format: 'color'
});

export const borderTopColor: IPropertyTypeValueDescriptor = borderColorForSide('top');
export const borderRightColor: IPropertyTypeValueDescriptor = borderColorForSide('right');
export const borderBottomColor: IPropertyTypeValueDescriptor = borderColorForSide('bottom');
export const borderLeftColor: IPropertyTypeValueDescriptor = borderColorForSide('left');
