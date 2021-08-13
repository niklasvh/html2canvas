import {IPropertyIdentValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {Context} from '../../core/context';
export enum LINE_BREAK {
    NORMAL = 'normal',
    STRICT = 'strict'
}

export const lineBreak: IPropertyIdentValueDescriptor<LINE_BREAK> = {
    name: 'line-break',
    initialValue: 'normal',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (_context: Context, lineBreak: string): LINE_BREAK => {
        switch (lineBreak) {
            case 'strict':
                return LINE_BREAK.STRICT;
            case 'normal':
            default:
                return LINE_BREAK.NORMAL;
        }
    }
};
