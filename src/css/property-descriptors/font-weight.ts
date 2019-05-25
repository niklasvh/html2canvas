import {IPropertyValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue, isIdentToken, isNumberToken} from '../syntax/parser';
export const fontWeight: IPropertyValueDescriptor<number> = {
    name: 'font-weight',
    initialValue: 'normal',
    type: PropertyDescriptorParsingType.VALUE,
    prefix: false,
    parse: (token: CSSValue): number => {
        if (isNumberToken(token)) {
            return token.number;
        }

        if (isIdentToken(token)) {
            switch (token.value) {
                case 'bold':
                    return 700;
                case 'normal':
                default:
                    return 400;
            }
        }

        return 400;
    }
};
