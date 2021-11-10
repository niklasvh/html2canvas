export declare class Logger {
    debug(): void;
    static create(): void;
    static destroy(): void;
    static getInstance(): Logger;
    info(): void;
    error(): void;
}
export declare const logger: Logger;
