var Color = require('../../src/color');
var assert = require('assert');

describe('Colors', function() {
    describe('named colors', function() {
        it('bisque', function() {
            var c = new Color('bisque');
            assertColor(c, 255, 228, 196, null);
            assert.equal(c.isTransparent(), false);
        });

        it('BLUE', function() {
            var c = new Color('BLUE');
            assertColor(c, 0, 0, 255, null);
            assert.equal(c.isTransparent(), false);
        });
    });

    describe('rgb()', function() {
        it('rgb(1,3,5)', function() {
            var c = new Color('rgb(1,3,5)');
            assertColor(c, 1, 3, 5, null);
            assert.equal(c.isTransparent(), false);
        });

        it('rgb(222, 111, 50)', function() {
            var c = new Color('rgb(222, 111, 50)');
            assertColor(c, 222, 111, 50, null);
            assert.equal(c.isTransparent(), false);
        });

        it('rgb( 222, 111 , 50)', function() {
            var c = new Color('rgb(222 , 111 , 50)');
            assertColor(c, 222, 111, 50, null);
            assert.equal(c.isTransparent(), false);
        });
    });

    describe('rgba()', function() {
        it('rgba(200,3,5,1)', function() {
            var c = new Color('rgba(200,3,5,1)');
            assertColor(c, 200, 3, 5, 1);
            assert.equal(c.isTransparent(), false);
        });

        it('rgba(222, 111, 50, 0.22)', function() {
            var c = new Color('rgba(222, 111, 50, 0.22)');
            assertColor(c, 222, 111, 50, 0.22);
            assert.equal(c.isTransparent(), false);
        });

        it('rgba( 222, 111 , 50, 0.123 )', function() {
            var c = new Color('rgba(222 , 111 , 50, 0.123)');
            assertColor(c, 222, 111, 50, 0.123);
            assert.equal(c.isTransparent(), false);
        });
    });

    describe('hex', function() {
        it('#7FFFD4', function() {
            var c = new Color('#7FFFD4');
            assertColor(c, 127, 255, 212, null);
            assert.equal(c.isTransparent(), false);
        });

        it('#f0ffff', function() {
            var c = new Color('#f0ffff');
            assertColor(c, 240, 255, 255, null);
            assert.equal(c.isTransparent(), false);
        });

        it('#fff', function() {
            var c = new Color('#fff');
            assertColor(c, 255, 255, 255, null);
            assert.equal(c.isTransparent(), false);
        });
    });

    describe('from array', function() {
        it('[1,2,3]', function() {
            var c = new Color([1, 2, 3]);
            assertColor(c, 1, 2, 3, null);
            assert.equal(c.isTransparent(), false);
        });

        it('[5,6,7,1]', function() {
            var c = new Color([5, 6, 7, 1]);
            assertColor(c, 5, 6, 7, 1);
            assert.equal(c.isTransparent(), false);
        });

        it('[5,6,7,0]', function() {
            var c = new Color([5, 6, 7, 0]);
            assertColor(c, 5, 6, 7, 0);
            assert.equal(c.isTransparent(), true);
        });
    });

    describe('transparency', function() {
        it('transparent', function() {
            var c = new Color('transparent');
            assertColor(c, 0, 0, 0, 0);
            assert.equal(c.isTransparent(), true);
        });

        it('rgba(255,255,255,0)', function() {
            var c = new Color('rgba(255,255,255,0)');
            assertColor(c, 255, 255, 255, 0);
            assert.equal(c.isTransparent(), true);
        });
    });
});

function assertColor(c, r, g, b, a) {
    assert.equal(c.r, r);
    assert.equal(c.g, g);
    assert.equal(c.b, b);
    assert.equal(c.a, a);
}
