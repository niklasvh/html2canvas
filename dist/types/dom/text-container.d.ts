import { CSSParsedDeclaration } from '../css/index';
import { TextBounds } from '../css/layout/text';
export declare class TextContainer {
    text: string;
    textBounds: TextBounds[];
    constructor(node: Text, styles: CSSParsedDeclaration);
}
