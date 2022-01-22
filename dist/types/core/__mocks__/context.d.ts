import { Logger } from './logger';
export declare class Context {
    readonly logger: Logger;
    readonly _cache: {
        [key: string]: Promise<any>;
    };
    readonly cache: any;
    constructor();
}
