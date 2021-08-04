import {IPropertyListDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue} from '../syntax/parser';
import {isLengthPercentage, LengthPercentage} from '../types/length-percentage';
import {FLAG_INTEGER, TokenType} from '../syntax/tokenizer';
import {Context} from '../../core/context';
export type TransformOrigin = [LengthPercentage, LengthPercentage];

const DEFAULT_VALUE: LengthPercentage = {
    type: TokenType.PERCENTAGE_TOKEN,
    number: 50,
    flags: FLAG_INTEGER
};
const DEFAULT: TransformOrigin = [DEFAULT_VALUE, DEFAULT_VALUE];

export const transformOrigin: IPropertyListDescriptor<TransformOrigin> = {
    name: 'transform-origin',
    initialValue: '50% 50%',
    prefix: true,
    type: PropertyDescriptorParsingType.LIST,
    parse: (_context: Context, tokens: CSSValue[]) => {
        const origins: LengthPercentage[] = tokens.filter(isLengthPercentage);

        if (origins.length !== 2) {
            return DEFAULT;
        }

        return [origins[0], origins[1]];
    }
};
