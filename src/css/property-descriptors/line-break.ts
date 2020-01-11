import {IPropertyIdentValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
export enum LINE_BREAK {
    NORMAL = 'normal',
    STRICT = 'strict'
}

export const lineBreak: IPropertyIdentValueDescriptor<LINE_BREAK> = {
    name: 'line-break',
    initialValue: 'normal',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (lineBreak: string): LINE_BREAK => {
        switch (lineBreak) {
            case 'strict':
                return LINE_BREAK.STRICT;
            case 'normal':
            default:
                return LINE_BREAK.NORMAL;
        }
    }
};
