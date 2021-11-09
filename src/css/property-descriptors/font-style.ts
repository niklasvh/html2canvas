import {IPropertyIdentValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {Context} from '../../core/context';
export const enum FONT_STYLE {
    NORMAL = 'normal',
    ITALIC = 'italic',
    OBLIQUE = 'oblique'
}

export const fontStyle: IPropertyIdentValueDescriptor<FONT_STYLE> = {
    name: 'font-style',
    initialValue: 'normal',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (_context: Context, overflow: string) => {
        switch (overflow) {
            case 'oblique':
                return FONT_STYLE.OBLIQUE;
            case 'italic':
                return FONT_STYLE.ITALIC;
            case 'normal':
            default:
                return FONT_STYLE.NORMAL;
        }
    }
};
