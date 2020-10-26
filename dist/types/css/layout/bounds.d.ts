export declare class Bounds {
    readonly top: number;
    readonly left: number;
    readonly width: number;
    readonly height: number;
    constructor(x: number, y: number, w: number, h: number);
    add(x: number, y: number, w: number, h: number): Bounds;
    static fromClientRect(clientRect: ClientRect): Bounds;
}
export declare const parseBounds: (node: Element) => Bounds;
export declare const parseDocumentSize: (document: Document) => Bounds;
