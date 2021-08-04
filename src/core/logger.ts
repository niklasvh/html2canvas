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
    warn(...args: unknown[]): void {
        if (this.enabled) {
            // eslint-disable-next-line no-console
            if (typeof window !== 'undefined' && window.console && typeof console.warn === 'function') {
                // eslint-disable-next-line no-console
                console.warn(this.id, `${this.getTime()}ms`, ...args);
            } else {
                this.info(...args);
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
