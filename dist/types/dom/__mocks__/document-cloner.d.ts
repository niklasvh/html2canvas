export declare class DocumentCloner {
    clonedReferenceElement?: HTMLElement;
    constructor();
    toIFrame(): Promise<HTMLIFrameElement>;
    static destroy(): boolean;
}
