import {IPropertyValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue, isDimensionToken, isIdentWithValue, nonFunctionArgSeparator} from '../syntax/parser';
import {Context} from '../../core/context';
import {DimensionToken, TokenType} from '../syntax/tokenizer';

export interface RectClip {
    top: DimensionToken;
    right: DimensionToken;
    bottom: DimensionToken;
    left: DimensionToken;
}

export const clip: IPropertyValueDescriptor<RectClip | null> = {
    name: 'clip',
    initialValue: 'auto',
    type: PropertyDescriptorParsingType.VALUE,
    prefix: false,
    parse: (_context: Context, token: CSSValue) => {
        if (isIdentWithValue(token, 'auto')) {
            return null;
        }
        if (token.type !== TokenType.FUNCTION || token.name !== 'rect') {
            throw new Error('Clip value must be auto or a rect function');
        }

        const rectArgs = token.values.filter(nonFunctionArgSeparator).filter(isDimensionToken);
        if (rectArgs.length !== 4) {
            throw new Error('Rect clip must have 4 dimension elements');
        }

        return {
            top: rectArgs[0],
            right: rectArgs[1],
            bottom: rectArgs[2],
            left: rectArgs[3]
        };
    }
};
