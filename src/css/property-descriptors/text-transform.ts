import {IPropertyIdentValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {Context} from '../../core/context';
export const enum TEXT_TRANSFORM {
    NONE = 0,
    LOWERCASE = 1,
    UPPERCASE = 2,
    CAPITALIZE = 3
}

export const textTransform: IPropertyIdentValueDescriptor<TEXT_TRANSFORM> = {
    name: 'text-transform',
    initialValue: 'none',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (_context: Context, textTransform: string) => {
        switch (textTransform) {
            case 'uppercase':
                return TEXT_TRANSFORM.UPPERCASE;
            case 'lowercase':
                return TEXT_TRANSFORM.LOWERCASE;
            case 'capitalize':
                return TEXT_TRANSFORM.CAPITALIZE;
        }

        return TEXT_TRANSFORM.NONE;
    }
};
