interface CSSStyleDeclaration {
    textDecorationColor: string | null
    textDecorationLine: string | null
    overflowWrap: string | null
}

interface Window {
    HTMLElement: HTMLElement.prototype.constructor
}

interface DocumentType extends Node, ChildNode {
    readonly internalSubset: string | null;
}
