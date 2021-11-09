export class Logger {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    debug(): void {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    static create(): void {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    static destroy(): void {}

    static getInstance(): Logger {
        return logger;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    info(): void {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    error(): void {}
}

export const logger = new Logger();
