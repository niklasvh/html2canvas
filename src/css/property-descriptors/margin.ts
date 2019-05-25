import {IPropertyTokenValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';

const marginForSide = (side: string): IPropertyTokenValueDescriptor => ({
    name: `margin-${side}`,
    initialValue: '0',
    prefix: false,
    type: PropertyDescriptorParsingType.TOKEN_VALUE
});

export const marginTop: IPropertyTokenValueDescriptor = marginForSide('top');
export const marginRight: IPropertyTokenValueDescriptor = marginForSide('right');
export const marginBottom: IPropertyTokenValueDescriptor = marginForSide('bottom');
export const marginLeft: IPropertyTokenValueDescriptor = marginForSide('left');
