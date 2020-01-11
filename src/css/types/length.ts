import {CSSValue} from '../syntax/parser';
import {DimensionToken, NumberValueToken, TokenType} from '../syntax/tokenizer';

export type Length = DimensionToken | NumberValueToken;

export const isLength = (token: CSSValue): token is Length =>
    token.type === TokenType.NUMBER_TOKEN || token.type === TokenType.DIMENSION_TOKEN;
