export class DocumentCloner {
    clonedReferenceElement?: HTMLElement;

    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
        this.clonedReferenceElement = {} as HTMLElement;
    }

    toIFrame() {
        return Promise.resolve({});
    }

    static destroy() {
        return true;
    }
}
