import {IPropertyIdentValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
export enum POSITION {
    STATIC = 0,
    RELATIVE = 1,
    ABSOLUTE = 2,
    FIXED = 3,
    STICKY = 4
}

export const position: IPropertyIdentValueDescriptor<POSITION> = {
    name: 'position',
    initialValue: 'static',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (position: string) => {
        switch (position) {
            case 'relative':
                return POSITION.RELATIVE;
            case 'absolute':
                return POSITION.ABSOLUTE;
            case 'fixed':
                return POSITION.FIXED;
            case 'sticky':
                return POSITION.STICKY;
        }

        return POSITION.STATIC;
    }
};
