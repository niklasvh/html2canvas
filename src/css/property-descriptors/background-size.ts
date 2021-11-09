import {IPropertyListDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue, isIdentToken, parseFunctionArgs} from '../syntax/parser';
import {isLengthPercentage, LengthPercentage} from '../types/length-percentage';
import {StringValueToken} from '../syntax/tokenizer';
import {Context} from '../../core/context';

export enum BACKGROUND_SIZE {
    AUTO = 'auto',
    CONTAIN = 'contain',
    COVER = 'cover'
}

export type BackgroundSizeInfo = LengthPercentage | StringValueToken;
export type BackgroundSize = BackgroundSizeInfo[][];

export const backgroundSize: IPropertyListDescriptor<BackgroundSize> = {
    name: 'background-size',
    initialValue: '0',
    prefix: false,
    type: PropertyDescriptorParsingType.LIST,
    parse: (_context: Context, tokens: CSSValue[]): BackgroundSize => {
        return parseFunctionArgs(tokens).map((values) => values.filter(isBackgroundSizeInfoToken));
    }
};

const isBackgroundSizeInfoToken = (value: CSSValue): value is BackgroundSizeInfo =>
    isIdentToken(value) || isLengthPercentage(value);
