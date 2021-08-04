export class DocumentCloner {
    clonedReferenceElement?: HTMLElement;

    constructor() {
        this.clonedReferenceElement = {
            ownerDocument: {
                defaultView: {
                    pageXOffset: 12,
                    pageYOffset: 34
                }
            }
        } as HTMLElement;
    }

    toIFrame(): Promise<HTMLIFrameElement> {
        return Promise.resolve({} as HTMLIFrameElement);
    }

    static destroy(): boolean {
        return true;
    }
}
