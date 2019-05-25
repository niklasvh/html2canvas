import {IPropertyListDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue} from '../syntax/parser';
import {isLengthPercentage, LengthPercentageTuple, parseLengthPercentageTuple} from '../types/length-percentage';
export type BorderRadius = LengthPercentageTuple;

const borderRadiusForSide = (side: string): IPropertyListDescriptor<BorderRadius> => ({
    name: `border-radius-${side}`,
    initialValue: '0 0',
    prefix: false,
    type: PropertyDescriptorParsingType.LIST,
    parse: (tokens: CSSValue[]): BorderRadius => parseLengthPercentageTuple(tokens.filter(isLengthPercentage))
});

export const borderTopLeftRadius: IPropertyListDescriptor<BorderRadius> = borderRadiusForSide('top-left');
export const borderTopRightRadius: IPropertyListDescriptor<BorderRadius> = borderRadiusForSide('top-right');
export const borderBottomRightRadius: IPropertyListDescriptor<BorderRadius> = borderRadiusForSide('bottom-right');
export const borderBottomLeftRadius: IPropertyListDescriptor<BorderRadius> = borderRadiusForSide('bottom-left');
