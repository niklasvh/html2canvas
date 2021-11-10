import { IPropertyValueDescriptor } from '../IPropertyDescriptor';
export declare type Matrix = [number, number, number, number, number, number];
export declare type Transform = Matrix | null;
export declare const transform: IPropertyValueDescriptor<Transform>;
