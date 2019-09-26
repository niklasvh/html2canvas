export class Logger {
    debug() {}

    static create() {}

    static destroy() {}

    static getInstance(): Logger {
        return logger;
    }

    info() {}

    error() {}
}

const logger = new Logger();
