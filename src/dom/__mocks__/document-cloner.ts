export class DocumentCloner {
    clonedReferenceElement?: HTMLElement;

    constructor() {
        this.clonedReferenceElement = {} as HTMLElement;
    }

    toIFrame(): Promise<HTMLIFrameElement> {
        return Promise.resolve({} as HTMLIFrameElement);
    }

    static destroy(): boolean {
        return true;
    }
}
