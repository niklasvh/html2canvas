import {
    CSSToken,
    DimensionToken,
    EOF_TOKEN,
    NumberValueToken,
    StringValueToken,
    Tokenizer,
    TokenType
} from './tokenizer';

export type CSSBlockType =
    | TokenType.LEFT_PARENTHESIS_TOKEN
    | TokenType.LEFT_SQUARE_BRACKET_TOKEN
    | TokenType.LEFT_CURLY_BRACKET_TOKEN;

export interface CSSBlock {
    type: CSSBlockType;
    values: CSSValue[];
}

export interface CSSFunction {
    type: TokenType.FUNCTION;
    name: string;
    values: CSSValue[];
}

export type CSSValue = CSSFunction | CSSToken | CSSBlock;

export class Parser {
    private _tokens: CSSToken[];

    constructor(tokens: CSSToken[]) {
        this._tokens = tokens;
    }

    static create(value: string): Parser {
        const tokenizer = new Tokenizer();
        tokenizer.write(value);
        return new Parser(tokenizer.read());
    }

    static parseValue(value: string): CSSValue {
        return Parser.create(value).parseComponentValue();
    }

    static parseValues(value: string): CSSValue[] {
        return Parser.create(value).parseComponentValues();
    }

    parseComponentValue(): CSSValue {
        let token = this.consumeToken();
        while (token.type === TokenType.WHITESPACE_TOKEN) {
            token = this.consumeToken();
        }

        if (token.type === TokenType.EOF_TOKEN) {
            throw new SyntaxError(`Error parsing CSS component value, unexpected EOF`);
        }

        this.reconsumeToken(token);
        const value = this.consumeComponentValue();

        do {
            token = this.consumeToken();
        } while (token.type === TokenType.WHITESPACE_TOKEN);

        if (token.type === TokenType.EOF_TOKEN) {
            return value;
        }

        throw new SyntaxError(`Error parsing CSS component value, multiple values found when expecting only one`);
    }

    parseComponentValues(): CSSValue[] {
        const values = [];
        while (true) {
            const value = this.consumeComponentValue();
            if (value.type === TokenType.EOF_TOKEN) {
                return values;
            }
            values.push(value);
            values.push();
        }
    }

    private consumeComponentValue(): CSSValue {
        const token = this.consumeToken();

        switch (token.type) {
            case TokenType.LEFT_CURLY_BRACKET_TOKEN:
            case TokenType.LEFT_SQUARE_BRACKET_TOKEN:
            case TokenType.LEFT_PARENTHESIS_TOKEN:
                return this.consumeSimpleBlock(token.type);
            case TokenType.FUNCTION_TOKEN:
                return this.consumeFunction(token);
        }

        return token;
    }

    private consumeSimpleBlock(type: CSSBlockType): CSSBlock {
        const block: CSSBlock = {type, values: []};

        let token = this.consumeToken();
        while (true) {
            if (token.type === TokenType.EOF_TOKEN || isEndingTokenFor(token, type)) {
                return block;
            }

            this.reconsumeToken(token);
            block.values.push(this.consumeComponentValue());
            token = this.consumeToken();
        }
    }

    private consumeFunction(functionToken: StringValueToken): CSSFunction {
        const cssFunction: CSSFunction = {
            name: functionToken.value,
            values: [],
            type: TokenType.FUNCTION
        };

        while (true) {
            const token = this.consumeToken();
            if (token.type === TokenType.EOF_TOKEN || token.type === TokenType.RIGHT_PARENTHESIS_TOKEN) {
                return cssFunction;
            }

            this.reconsumeToken(token);
            cssFunction.values.push(this.consumeComponentValue());
        }
    }

    private consumeToken(): CSSToken {
        const token = this._tokens.shift();
        return typeof token === 'undefined' ? EOF_TOKEN : token;
    }

    private reconsumeToken(token: CSSToken): void {
        this._tokens.unshift(token);
    }
}

export const isDimensionToken = (token: CSSValue): token is DimensionToken => token.type === TokenType.DIMENSION_TOKEN;
export const isNumberToken = (token: CSSValue): token is NumberValueToken => token.type === TokenType.NUMBER_TOKEN;
export const isIdentToken = (token: CSSValue): token is StringValueToken => token.type === TokenType.IDENT_TOKEN;
export const isStringToken = (token: CSSValue): token is StringValueToken => token.type === TokenType.STRING_TOKEN;
export const isIdentWithValue = (token: CSSValue, value: string): boolean =>
    isIdentToken(token) && token.value === value;

export const nonWhiteSpace = (token: CSSValue): boolean => token.type !== TokenType.WHITESPACE_TOKEN;
export const nonFunctionArgSeparator = (token: CSSValue): boolean =>
    token.type !== TokenType.WHITESPACE_TOKEN && token.type !== TokenType.COMMA_TOKEN;

export const parseFunctionArgs = (tokens: CSSValue[]): CSSValue[][] => {
    const args: CSSValue[][] = [];
    let arg: CSSValue[] = [];
    tokens.forEach((token) => {
        if (token.type === TokenType.COMMA_TOKEN) {
            if (arg.length === 0) {
                throw new Error(`Error parsing function args, zero tokens for arg`);
            }
            args.push(arg);
            arg = [];
            return;
        }

        if (token.type !== TokenType.WHITESPACE_TOKEN) {
            arg.push(token);
        }
    });
    if (arg.length) {
        args.push(arg);
    }

    return args;
};

const isEndingTokenFor = (token: CSSToken, type: CSSBlockType): boolean => {
    if (type === TokenType.LEFT_CURLY_BRACKET_TOKEN && token.type === TokenType.RIGHT_CURLY_BRACKET_TOKEN) {
        return true;
    }
    if (type === TokenType.LEFT_SQUARE_BRACKET_TOKEN && token.type === TokenType.RIGHT_SQUARE_BRACKET_TOKEN) {
        return true;
    }

    return type === TokenType.LEFT_PARENTHESIS_TOKEN && token.type === TokenType.RIGHT_PARENTHESIS_TOKEN;
};
