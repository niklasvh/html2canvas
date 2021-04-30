"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("assert");
var tokenizer_1 = require("../tokenizer");
var tokenize = function (value) {
    var tokenizer = new tokenizer_1.Tokenizer();
    tokenizer.write(value);
    return tokenizer.read();
};
describe('tokenizer', function () {
    describe('<ident>', function () {
        it('auto', function () { return assert_1.deepEqual(tokenize('auto'), [{ type: tokenizer_1.TokenType.IDENT_TOKEN, value: 'auto' }]); });
        it('url', function () { return assert_1.deepEqual(tokenize('url'), [{ type: tokenizer_1.TokenType.IDENT_TOKEN, value: 'url' }]); });
        it('auto test', function () {
            return assert_1.deepEqual(tokenize('auto        test'), [
                { type: tokenizer_1.TokenType.IDENT_TOKEN, value: 'auto' },
                { type: tokenizer_1.TokenType.WHITESPACE_TOKEN },
                { type: tokenizer_1.TokenType.IDENT_TOKEN, value: 'test' }
            ]);
        });
    });
    describe('<url-token>', function () {
        it('url(test.jpg)', function () {
            return assert_1.deepEqual(tokenize('url(test.jpg)'), [{ type: tokenizer_1.TokenType.URL_TOKEN, value: 'test.jpg' }]);
        });
        it('url("test.jpg")', function () {
            return assert_1.deepEqual(tokenize('url("test.jpg")'), [{ type: tokenizer_1.TokenType.URL_TOKEN, value: 'test.jpg' }]);
        });
        it("url('test.jpg')", function () {
            return assert_1.deepEqual(tokenize("url('test.jpg')"), [{ type: tokenizer_1.TokenType.URL_TOKEN, value: 'test.jpg' }]);
        });
    });
});
//# sourceMappingURL=tokernizer-tests.js.map