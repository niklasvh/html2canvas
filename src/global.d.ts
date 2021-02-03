interface CSSStyleDeclaration {
    textDecorationColor: string | null;
    textDecorationLine: string | null;
    overflowWrap: string | null;
    paintOrder: string | null;
}

interface DocumentType extends Node, ChildNode {
    readonly internalSubset: string | null;
}

interface Document {
    fonts: any;
}
