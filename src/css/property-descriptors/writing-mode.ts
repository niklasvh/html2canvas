import {IPropertyIdentValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
export enum WRITING_MODE {
    HORIZONTAL_TB = 'horizontal-tb',
    VERTICAL_RL = 'vertical-rl',
    VERTICAL_LR = 'vertical-lr'
}

export const writingMode: IPropertyIdentValueDescriptor<WRITING_MODE> = {
    name: 'writing-mode',
    initialValue: 'horizontal-tb',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (writingMode: string): WRITING_MODE => {
        switch (writingMode) {
            case 'horizontal-tb':
                return WRITING_MODE.HORIZONTAL_TB;
            case 'vertical-rl':
                return WRITING_MODE.VERTICAL_RL;
            case 'vertical-lr':
                return WRITING_MODE.VERTICAL_LR;
            default:
                return WRITING_MODE.HORIZONTAL_TB;
        }
    }
};
