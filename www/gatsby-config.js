const gzipSize = require('gzip-size');
const path = require('path');
const fs = require('fs');

module.exports = {
    siteMetadata: {
        title: `html2canvas`,
        packageSize: gzipSize.sync(
            fs.readFileSync(path.resolve(__dirname, '../dist/html2canvas.min.js'))
        )
    },
    plugins: [
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/../docs/`
            }
        },
        `gatsby-plugin-catch-links`,
        `gatsby-plugin-twitter`,
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-glamor`,
        {
            resolve: `gatsby-plugin-typography`,
            options: {
                pathToConfigModule: `src/utils/typography.js`
            }
        },
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [
                    {
                        resolve: `gatsby-remark-prismjs`,
                        options: {
                            // Class prefix for <pre> tags containing syntax highlighting;
                            // defaults to 'language-' (eg <pre class="language-js">).
                            // If your site loads Prism into the browser at runtime,
                            // (eg for use with libraries like react-live),
                            // you may use this to prevent Prism from re-processing syntax.
                            // This is an uncommon use-case though;
                            // If you're unsure, it's best to use the default value.
                            classPrefix: 'language-'
                        }
                    }
                ]
            }
        },
        {
            resolve: `gatsby-plugin-google-analytics`,
            options: {
                trackingId: 'UA-188600-10'
            }
        }
    ]
};
