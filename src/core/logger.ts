export class Logger {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static debug(...args: any) {
        // eslint-disable-next-line no-console
        console.debug(...args);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static info(...args: any) {
        // eslint-disable-next-line no-console
        console.info(...args);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static error(...args: any) {
        // eslint-disable-next-line no-console
        console.error(...args);
    }
}
