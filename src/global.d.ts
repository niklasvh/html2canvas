interface CSSStyleDeclaration {
    textDecorationColor: string;
    textDecorationLine: string;
    overflowWrap: string;
}

interface DocumentType extends Node, ChildNode {
    readonly internalSubset: string | null;
}

interface Document {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fonts: any;
}
