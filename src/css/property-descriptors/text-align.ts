import {IPropertyIdentValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {Context} from '../../core/context';
export const enum TEXT_ALIGN {
    LEFT = 0,
    CENTER = 1,
    RIGHT = 2
}

export const textAlign: IPropertyIdentValueDescriptor<TEXT_ALIGN> = {
    name: 'text-align',
    initialValue: 'left',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (_context: Context, textAlign: string) => {
        switch (textAlign) {
            case 'right':
                return TEXT_ALIGN.RIGHT;
            case 'center':
            case 'justify':
                return TEXT_ALIGN.CENTER;
            case 'left':
            default:
                return TEXT_ALIGN.LEFT;
        }
    }
};
