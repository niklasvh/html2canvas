import { CSSParsedDeclaration } from '../index';
import { Bounds } from './bounds';
import { Context } from '../../core/context';
export declare class TextBounds {
    readonly text: string;
    readonly bounds: Bounds;
    constructor(text: string, bounds: Bounds);
}
export declare const parseTextBounds: (context: Context, value: string, styles: CSSParsedDeclaration, node: Text) => TextBounds[];
