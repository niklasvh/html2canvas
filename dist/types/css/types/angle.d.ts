import { CSSValue } from '../syntax/parser';
import { ITypeDescriptor } from '../ITypeDescriptor';
export declare const angle: ITypeDescriptor<number>;
export declare const isAngle: (value: CSSValue) => boolean;
export declare const parseNamedSide: (tokens: CSSValue[]) => number | [import("./length-percentage").LengthPercentage, import("./length-percentage").LengthPercentage];
export declare const deg: (deg: number) => number;
