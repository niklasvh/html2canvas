import {strictEqual} from 'assert';
import {asString, color, isTransparent, pack} from '../color';
import {Parser} from '../../syntax/parser';
import {Context} from '../../../core/context';

const parse = (value: string) => color.parse({} as Context, Parser.parseValue(value));

describe('types', () => {
    describe('<color>', () => {
        describe('parsing', () => {
            it('#000', () => strictEqual(parse('#000'), pack(0, 0, 0, 1)));
            it('#0000', () => strictEqual(parse('#0000'), pack(0, 0, 0, 0)));
            it('#000f', () => strictEqual(parse('#000f'), pack(0, 0, 0, 1)));
            it('#fff', () => strictEqual(parse('#fff'), pack(255, 255, 255, 1)));
            it('#000000', () => strictEqual(parse('#000000'), pack(0, 0, 0, 1)));
            it('#00000000', () => strictEqual(parse('#00000000'), pack(0, 0, 0, 0)));
            it('#ffffff', () => strictEqual(parse('#ffffff'), pack(255, 255, 255, 1)));
            it('#ffffffff', () => strictEqual(parse('#ffffffff'), pack(255, 255, 255, 1)));
            it('#7FFFD4', () => strictEqual(parse('#7FFFD4'), pack(127, 255, 212, 1)));
            it('#f0ffff', () => strictEqual(parse('#f0ffff'), pack(240, 255, 255, 1)));
            it('transparent', () => strictEqual(parse('transparent'), pack(0, 0, 0, 0)));
            it('bisque', () => strictEqual(parse('bisque'), pack(255, 228, 196, 1)));
            it('BLUE', () => strictEqual(parse('BLUE'), pack(0, 0, 255, 1)));
            it('rgb(1, 3, 5)', () => strictEqual(parse('rgb(1, 3, 5)'), pack(1, 3, 5, 1)));
            it('rgb(0% 0% 0%)', () => strictEqual(parse('rgb(0% 0% 0%)'), pack(0, 0, 0, 1)));
            it('rgb(50% 50% 50%)', () => strictEqual(parse('rgb(50% 50% 50%)'), pack(128, 128, 128, 1)));
            it('rgba(50% 50% 50% 50%)', () => strictEqual(parse('rgba(50% 50% 50% 50%)'), pack(128, 128, 128, 0.5)));
            it('rgb(100% 100% 100%)', () => strictEqual(parse('rgb(100% 100% 100%)'), pack(255, 255, 255, 1)));
            it('rgb(222 111 50)', () => strictEqual(parse('rgb(222 111 50)'), pack(222, 111, 50, 1)));
            it('rgba(200, 3, 5, 1)', () => strictEqual(parse('rgba(200, 3, 5, 1)'), pack(200, 3, 5, 1)));
            it('rgba(222, 111, 50, 0.22)', () =>
                strictEqual(parse('rgba(222, 111, 50, 0.22)'), pack(222, 111, 50, 0.22)));
            it('rgba(222 111 50 0.123)', () => strictEqual(parse('rgba(222 111 50 0.123)'), pack(222, 111, 50, 0.123)));
            it('hsl(270,60%,70%)', () => strictEqual(parse('hsl(270,60%,70%)'), parse('rgb(178,132,224)')));
            it('hsl(270, 60%, 70%)', () => strictEqual(parse('hsl(270, 60%, 70%)'), parse('rgb(178,132,224)')));
            it('hsl(270 60% 70%)', () => strictEqual(parse('hsl(270 60% 70%)'), parse('rgb(178,132,224)')));
            it('hsl(270deg, 60%, 70%)', () => strictEqual(parse('hsl(270deg, 60%, 70%)'), parse('rgb(178,132,224)')));
            it('hsl(4.71239rad, 60%, 70%)', () =>
                strictEqual(parse('hsl(4.71239rad, 60%, 70%)'), parse('rgb(178,132,224)')));
            it('hsl(.75turn, 60%, 70%)', () => strictEqual(parse('hsl(.75turn, 60%, 70%)'), parse('rgb(178,132,224)')));
            it('hsla(.75turn, 60%, 70%, 50%)', () =>
                strictEqual(parse('hsl(.75turn, 60%, 70%, 50%)'), parse('rgba(178,132,224, 0.5)')));
        });
        describe('util', () => {
            describe('isTransparent', () => {
                it('transparent', () => strictEqual(isTransparent(parse('transparent')), true));
                it('#000', () => strictEqual(isTransparent(parse('#000')), false));
                it('#000f', () => strictEqual(isTransparent(parse('#000f')), false));
                it('#0001', () => strictEqual(isTransparent(parse('#0001')), false));
                it('#0000', () => strictEqual(isTransparent(parse('#0000')), true));
            });

            describe('toString', () => {
                it('transparent', () => strictEqual(asString(parse('transparent')), 'rgba(0,0,0,0)'));
                it('#000', () => strictEqual(asString(parse('#000')), 'rgb(0,0,0)'));
                it('#000f', () => strictEqual(asString(parse('#000f')), 'rgb(0,0,0)'));
                it('#000f', () => strictEqual(asString(parse('#000c')), 'rgba(0,0,0,0.8)'));
                it('#fff', () => strictEqual(asString(parse('#fff')), 'rgb(255,255,255)'));
                it('#ffff', () => strictEqual(asString(parse('#ffff')), 'rgb(255,255,255)'));
                it('#fffc', () => strictEqual(asString(parse('#fffc')), 'rgba(255,255,255,0.8)'));
            });
        });
    });
});
