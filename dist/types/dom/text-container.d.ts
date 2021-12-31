import { CSSParsedDeclaration } from '../css/index';
import { TextBounds } from '../css/layout/text';
import { Context } from '../core/context';
export declare class TextContainer {
    text: string;
    textBounds: TextBounds[];
    constructor(context: Context, node: Text, styles: CSSParsedDeclaration);
}
