const Gradient = require('../../dist/npm/Gradient');
const assert = require('assert');

describe('Gradient', () => {
    describe('transformWebkitRadialGradientArgs', () => {
        it('white, black', () => {
            assert.equal(Gradient.transformWebkitRadialGradientArgs(['white', 'black'])[0], '');
        });

        it('circle, white, black', () => {
            assert.equal(
                Gradient.transformWebkitRadialGradientArgs(['circle', 'white', 'black'])[0],
                'circle'
            );
        });

        it('10% 30%, white, black', () => {
            assert.equal(
                Gradient.transformWebkitRadialGradientArgs(['10% 30%', 'white', 'black'])[0],
                '10% 30%'
            );
        });

        it('30% 30%, closest-corner, white, black', () => {
            assert.equal(
                Gradient.transformWebkitRadialGradientArgs([
                    '30% 30%',
                    'closest-corner',
                    'white',
                    'black'
                ])[0],
                'closest-corner at 30% 30%'
            );
        });

        it('30% 30%, circle closest-corner, white, black', () => {
            assert.equal(
                Gradient.transformWebkitRadialGradientArgs([
                    '30% 30%',
                    'circle closest-corner',
                    'white',
                    'black'
                ])[0],
                'circle closest-corner at 30% 30%'
            );
        });

        it('center, 5em 40px, white, black', () => {
            assert.equal(
                Gradient.transformWebkitRadialGradientArgs([
                    'center',
                    '5em 40px',
                    'white',
                    'black'
                ])[0],
                '5em 40px at center'
            );
        });

        it('45 45, 10, 52 50, 30, from(#A7D30C), to(red)', () => {
            assert.equal(
                Gradient.transformWebkitRadialGradientArgs([
                    '45 45',
                    '10',
                    '52 50',
                    '30',
                    'from(#A7D30C)'
                ])[0],
                '30px at 52px 50px'
            );
        });

        it('75% 19%, ellipse closest-side, #ababab, #0000ff 33%,#991f1f 100%', () => {
            assert.equal(
                Gradient.transformWebkitRadialGradientArgs([
                    '75% 19%',
                    'ellipse closest-side',
                    '#ababab',
                    '#0000ff 33%',
                    '#991f1f 100%'
                ])[0],
                'ellipse closest-side at 75% 19%'
            );
        });

        it('75% 19%, circle contain, #ababab, #0000ff 33%,#991f1f 100%', () => {
            assert.equal(
                Gradient.transformWebkitRadialGradientArgs([
                    '75% 19%',
                    'circle contain',
                    '#ababab',
                    '#0000ff 33%',
                    '#991f1f 100%'
                ])[0],
                'circle closest-side at 75% 19%'
            );
        });

        it('75% 19%, circle cover, #ababab, #0000ff 33%,#991f1f 100%', () => {
            assert.equal(
                Gradient.transformWebkitRadialGradientArgs([
                    '75% 19%',
                    'circle cover',
                    '#ababab',
                    '#0000ff 33%',
                    '#991f1f 100%'
                ])[0],
                'circle farthest-corner at 75% 19%'
            );
        });

        it('right 19%, ellipse cover, #ababab, #0000ff 33%,#991f1f 100%', () => {
            assert.equal(
                Gradient.transformWebkitRadialGradientArgs([
                    'right 19%',
                    'ellipse cover',
                    '#ababab',
                    '#0000ff 33%',
                    '#991f1f 100%'
                ])[0],
                'ellipse farthest-corner at right 19%'
            );
        });

        it('left 19%, ellipse cover, #ababab, #0000ff 33%,#991f1f 100%', () => {
            assert.equal(
                Gradient.transformWebkitRadialGradientArgs([
                    'left 19%',
                    'ellipse cover',
                    '#ababab',
                    '#0000ff 33%',
                    '#991f1f 100%'
                ])[0],
                'ellipse farthest-corner at left 19%'
            );
        });

        it('left top, circle cover, #ababab, #0000ff 33%,#991f1f 100%', () => {
            assert.equal(
                Gradient.transformWebkitRadialGradientArgs([
                    'left top',
                    'circle cover',
                    '#ababab',
                    '#0000ff 33%',
                    '#991f1f 100%'
                ])[0],
                'circle farthest-corner at left top'
            );
        });
    });
});
