interface CSSStyleDeclaration {
    textDecorationColor: string | null;
    textDecorationLine: string | null;
    textFillColor: string | null;
    overflowWrap: string | null;
}

interface DocumentType extends Node, ChildNode {
    readonly internalSubset: string | null;
}

interface Document {
    fonts: any;
}
