import {deepEqual} from 'assert';
import {Tokenizer, TokenType} from '../tokenizer';

const tokenize = (value: string) => {
    const tokenizer = new Tokenizer();
    tokenizer.write(value);
    return tokenizer.read();
};

describe('tokenizer', () => {
    describe('<ident>', () => {
        it('auto', () => deepEqual(tokenize('auto'), [{type: TokenType.IDENT_TOKEN, value: 'auto'}]));
        it('url', () => deepEqual(tokenize('url'), [{type: TokenType.IDENT_TOKEN, value: 'url'}]));
        it('auto test', () =>
            deepEqual(tokenize('auto        test'), [
                {type: TokenType.IDENT_TOKEN, value: 'auto'},
                {type: TokenType.WHITESPACE_TOKEN},
                {type: TokenType.IDENT_TOKEN, value: 'test'}
            ]));
    });
    describe('<url-token>', () => {
        it('url(test.jpg)', () =>
            deepEqual(tokenize('url(test.jpg)'), [{type: TokenType.URL_TOKEN, value: 'test.jpg'}]));
        it('url("test.jpg")', () =>
            deepEqual(tokenize('url("test.jpg")'), [{type: TokenType.URL_TOKEN, value: 'test.jpg'}]));
        it("url('test.jpg')", () =>
            deepEqual(tokenize("url('test.jpg')"), [{type: TokenType.URL_TOKEN, value: 'test.jpg'}]));
    });
});
