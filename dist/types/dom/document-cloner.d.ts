import { Bounds } from '../css/layout/bounds';
export interface CloneOptions {
    id: string;
    ignoreElements?: (element: Element) => boolean;
    onclone?: (document: Document) => void;
}
export declare type CloneConfigurations = CloneOptions & {
    inlineImages: boolean;
    copyStyles: boolean;
};
export declare class DocumentCloner {
    private readonly scrolledElements;
    private readonly options;
    private readonly referenceElement;
    clonedReferenceElement?: HTMLElement;
    private readonly documentElement;
    private readonly counters;
    private quoteDepth;
    constructor(element: HTMLElement, options: CloneConfigurations);
    toIFrame(ownerDocument: Document, windowSize: Bounds): Promise<HTMLIFrameElement>;
    createElementClone<T extends HTMLElement | SVGElement>(node: T): HTMLElement | SVGElement;
    createStyleClone(node: HTMLStyleElement): HTMLStyleElement;
    createCanvasClone(canvas: HTMLCanvasElement): HTMLImageElement | HTMLCanvasElement;
    cloneNode(node: Node): Node;
    resolvePseudoContent(node: Element, clone: Element, style: CSSStyleDeclaration, pseudoElt: PseudoElementType): HTMLElement | void;
    static destroy(container: HTMLIFrameElement): boolean;
}
declare enum PseudoElementType {
    BEFORE = 0,
    AFTER = 1
}
export declare const copyCSSStyles: <T extends HTMLElement | SVGElement>(style: CSSStyleDeclaration, target: T) => T;
export {};
