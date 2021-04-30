import { ITypeDescriptor } from '../ITypeDescriptor';
export declare type Color = number;
export declare const color: ITypeDescriptor<Color>;
export declare const isTransparent: (color: number) => boolean;
export declare const asString: (color: number) => string;
export declare const pack: (r: number, g: number, b: number, a: number) => number;
export declare const COLORS: {
    [key: string]: Color;
};
