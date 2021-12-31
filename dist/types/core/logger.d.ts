export interface LoggerOptions {
    id: string;
    enabled: boolean;
}
export declare class Logger {
    static instances: {
        [key: string]: Logger;
    };
    private readonly id;
    private readonly enabled;
    private readonly start;
    constructor({ id, enabled }: LoggerOptions);
    debug(...args: unknown[]): void;
    getTime(): number;
    info(...args: unknown[]): void;
    warn(...args: unknown[]): void;
    error(...args: unknown[]): void;
}
