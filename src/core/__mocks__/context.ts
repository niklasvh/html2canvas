import {logger, Logger} from './logger';

export class Context {
    readonly logger: Logger = logger;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly _cache: {[key: string]: Promise<any>} = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly cache: any;

    constructor() {
        this.cache = {
            addImage: jest.fn().mockImplementation((src: string): Promise<void> => {
                const result = Promise.resolve();
                this._cache[src] = result;
                return result;
            })
        };
    }
}
