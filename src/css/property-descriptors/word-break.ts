import {IPropertyIdentValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {Context} from '../../core/context';
export enum WORD_BREAK {
    NORMAL = 'normal',
    BREAK_ALL = 'break-all',
    KEEP_ALL = 'keep-all'
}

export const wordBreak: IPropertyIdentValueDescriptor<WORD_BREAK> = {
    name: 'word-break',
    initialValue: 'normal',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (_context: Context, wordBreak: string): WORD_BREAK => {
        switch (wordBreak) {
            case 'break-all':
                return WORD_BREAK.BREAK_ALL;
            case 'keep-all':
                return WORD_BREAK.KEEP_ALL;
            case 'normal':
            default:
                return WORD_BREAK.NORMAL;
        }
    }
};
