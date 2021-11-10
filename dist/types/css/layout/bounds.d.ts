import { Context } from '../../core/context';
export declare class Bounds {
    readonly left: number;
    readonly top: number;
    readonly width: number;
    readonly height: number;
    constructor(left: number, top: number, width: number, height: number);
    add(x: number, y: number, w: number, h: number): Bounds;
    static fromClientRect(context: Context, clientRect: ClientRect): Bounds;
    static fromDOMRectList(context: Context, domRectList: DOMRectList): Bounds;
    static EMPTY: Bounds;
}
export declare const parseBounds: (context: Context, node: Element) => Bounds;
export declare const parseDocumentSize: (document: Document) => Bounds;
