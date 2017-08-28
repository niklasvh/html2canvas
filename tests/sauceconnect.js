const sauceConnectLauncher = require('sauce-connect-launcher');

sauceConnectLauncher(
    {
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
        logger: console.log,
        // Log output from the `sc` process to stdout?
        verbose: true,

        // Enable verbose debugging (optional)
        verboseDebugging: true
    },
    err => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log('Sauce Connect ready');
    }
);
