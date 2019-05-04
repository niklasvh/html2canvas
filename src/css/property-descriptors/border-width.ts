import {IPropertyValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue, isDimensionToken} from '../syntax/parser';
const borderWidthForSide = (side: string): IPropertyValueDescriptor<number> => ({
    name: `border-${side}-width`,
    initialValue: '0',
    type: PropertyDescriptorParsingType.VALUE,
    prefix: false,
    parse: (token: CSSValue): number => {
        if (isDimensionToken(token)) {
            return token.number;
        }
        return 0;
    }
});

export const borderTopWidth: IPropertyValueDescriptor<number> = borderWidthForSide('top');
export const borderRightWidth: IPropertyValueDescriptor<number> = borderWidthForSide('right');
export const borderBottomWidth: IPropertyValueDescriptor<number> = borderWidthForSide('bottom');
export const borderLeftWidth: IPropertyValueDescriptor<number> = borderWidthForSide('left');
