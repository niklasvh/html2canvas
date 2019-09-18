import {IPropertyIdentValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
export enum BORDER_STYLE {
    NONE = 0,
    SOLID = 1,
    DASHED = 2,
    DOTTED = 3,
    DOUBLE = 4
}

const borderStyleForSide = (side: string): IPropertyIdentValueDescriptor<BORDER_STYLE> => ({
    name: `border-${side}-style`,
    initialValue: 'solid',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (style: string): BORDER_STYLE => {
        switch (style) {
            case 'none':
                return BORDER_STYLE.NONE;
            case 'dashed':
                return BORDER_STYLE.DASHED;
            case 'dotted':
                return BORDER_STYLE.DOTTED;
            case 'double':
                return BORDER_STYLE.DOUBLE;
        }
        return BORDER_STYLE.SOLID;
    }
});

export const borderTopStyle: IPropertyIdentValueDescriptor<BORDER_STYLE> = borderStyleForSide('top');
export const borderRightStyle: IPropertyIdentValueDescriptor<BORDER_STYLE> = borderStyleForSide('right');
export const borderBottomStyle: IPropertyIdentValueDescriptor<BORDER_STYLE> = borderStyleForSide('bottom');
export const borderLeftStyle: IPropertyIdentValueDescriptor<BORDER_STYLE> = borderStyleForSide('left');
