export class DocumentCloner {
    clonedReferenceElement?: HTMLElement;

    constructor() {
        this.clonedReferenceElement = {} as HTMLElement;
    }

    toIFrame() {
        return Promise.resolve({});
    }

    static destroy() {
        return true;
    }
}
