export interface LoggerOptions {
    id: string;
    enabled: boolean;
}

export class Logger {
    static instances: {[key: string]: Logger} = {};

    private readonly id: string;
    private readonly enabled: boolean;
    private readonly start: number;

    constructor({id, enabled}: LoggerOptions) {
        this.id = id;
        this.enabled = enabled;
        this.start = Date.now();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debug(...args: unknown[]): void {
        if (this.enabled) {
            // eslint-disable-next-line no-console
            if (typeof window !== 'undefined' && window.console && typeof console.debug === 'function') {
                // eslint-disable-next-line no-console
                console.debug(this.id, `${this.getTime()}ms`, ...args);
            } else {
                this.info(...args);
            }
        }
    }

    getTime(): number {
        return Date.now() - this.start;
    }

    static create(options: LoggerOptions): void {
        Logger.instances[options.id] = new Logger(options);
    }

    static destroy(id: string): void {
        delete Logger.instances[id];
    }

    static getInstance(id: string): Logger {
        const instance = Logger.instances[id];
        if (typeof instance === 'undefined') {
            throw new Error(`No logger instance found with id ${id}`);
        }
        return instance;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info(...args: unknown[]): void {
        if (this.enabled) {
            // eslint-disable-next-line no-console
            if (typeof window !== 'undefined' && window.console && typeof console.info === 'function') {
                // eslint-disable-next-line no-console
                console.info(this.id, `${this.getTime()}ms`, ...args);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error(...args: unknown[]): void {
        if (this.enabled) {
            // eslint-disable-next-line no-console
            if (typeof window !== 'undefined' && window.console && typeof console.error === 'function') {
                // eslint-disable-next-line no-console
                console.error(this.id, `${this.getTime()}ms`, ...args);
            } else {
                this.info(...args);
            }
        }
    }
}
