import { CSSValue } from '../syntax/parser';
import { ITypeDescriptor } from '../ITypeDescriptor';
import { GradientCorner } from './image';
export declare const angle: ITypeDescriptor<number>;
export declare const isAngle: (value: CSSValue) => boolean;
export declare const parseNamedSide: (tokens: CSSValue[]) => number | GradientCorner;
export declare const deg: (deg: number) => number;
