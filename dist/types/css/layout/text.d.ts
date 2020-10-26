import { CSSParsedDeclaration } from '../index';
import { Bounds } from './bounds';
export declare class TextBounds {
    readonly text: string;
    readonly bounds: Bounds;
    constructor(text: string, bounds: Bounds);
}
export declare const parseTextBounds: (value: string, styles: CSSParsedDeclaration, node: Text) => TextBounds[];
