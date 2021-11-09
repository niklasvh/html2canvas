import {CSSValue, isDimensionToken} from '../syntax/parser';
import {IPropertyValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {Context} from '../../core/context';
export const webkitTextStrokeWidth: IPropertyValueDescriptor<number> = {
    name: `-webkit-text-stroke-width`,
    initialValue: '0',
    type: PropertyDescriptorParsingType.VALUE,
    prefix: false,
    parse: (_context: Context, token: CSSValue): number => {
        if (isDimensionToken(token)) {
            return token.number;
        }
        return 0;
    }
};
