import { Bounds } from '../css/layout/bounds';
import { Context } from '../core/context';
export interface CloneOptions {
    ignoreElements?: (element: Element) => boolean;
    onclone?: (document: Document, element: HTMLElement) => void;
    allowTaint?: boolean;
}
export interface WindowOptions {
    scrollX: number;
    scrollY: number;
    windowWidth: number;
    windowHeight: number;
}
export declare type CloneConfigurations = CloneOptions & {
    inlineImages: boolean;
    copyStyles: boolean;
};
export declare class DocumentCloner {
    private readonly context;
    private readonly options;
    private readonly scrolledElements;
    private readonly referenceElement;
    clonedReferenceElement?: HTMLElement;
    private readonly documentElement;
    private readonly counters;
    private quoteDepth;
    constructor(context: Context, element: HTMLElement, options: CloneConfigurations);
    toIFrame(ownerDocument: Document, windowSize: Bounds): Promise<HTMLIFrameElement>;
    createElementClone<T extends HTMLElement | SVGElement>(node: T): HTMLElement | SVGElement;
    createCustomElementClone(node: HTMLElement): HTMLElement;
    createStyleClone(node: HTMLStyleElement): HTMLStyleElement;
    createCanvasClone(canvas: HTMLCanvasElement): HTMLImageElement | HTMLCanvasElement;
    createVideoClone(video: HTMLVideoElement): HTMLCanvasElement;
    appendChildNode(clone: HTMLElement | SVGElement, child: Node, copyStyles: boolean): void;
    cloneChildNodes(node: Element, clone: HTMLElement | SVGElement, copyStyles: boolean): void;
    cloneNode(node: Node, copyStyles: boolean): Node;
    resolvePseudoContent(node: Element, clone: Element, style: CSSStyleDeclaration, pseudoElt: PseudoElementType): HTMLElement | void;
    static destroy(container: HTMLIFrameElement): boolean;
}
declare enum PseudoElementType {
    BEFORE = 0,
    AFTER = 1
}
export declare const copyCSSStyles: <T extends HTMLElement | SVGElement>(style: CSSStyleDeclaration, target: T) => T;
export {};
