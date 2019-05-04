import {IPropertyIdentValueDescriptor, PropertyDescriptorParsingType} from "../IPropertyDescriptor";

export const enum TEXT_DECORATION_LINE {
    NONE = 0,
    UNDERLINE = 1,
    OVERLINE = 2,
    LINE_THROUGH = 3,
    BLINK = 4
}

export const textDecorationLine: IPropertyIdentValueDescriptor<TEXT_DECORATION_LINE> = {
    name: 'text-decoration-line',
    initialValue: 'none',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (line: string) => {
        switch (line) {
            case 'underline':
                return TEXT_DECORATION_LINE.UNDERLINE;
            case 'overline':
                return TEXT_DECORATION_LINE.OVERLINE;
            case 'line-through':
                return TEXT_DECORATION_LINE.LINE_THROUGH;
            case 'none':
                return TEXT_DECORATION_LINE.BLINK;
        }
        return TEXT_DECORATION_LINE.NONE;
    }
};