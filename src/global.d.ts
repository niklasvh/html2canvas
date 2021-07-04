interface CSSStyleDeclaration {
    textDecorationColor: string;
    textDecorationLine: string;
    overflowWrap: string;
}

interface DocumentType extends Node, ChildNode {
    readonly internalSubset: string | null;
}

interface Document {
    fonts: any;
}
