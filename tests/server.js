const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const serveIndex = require('serve-index');
const proxy = require('html2canvas-proxy');

const PORT = 8080;
const CORS_PORT = 8081;

const app = express();
app.use('/', serveIndex(path.resolve(__dirname, '../'), {icons: true}));
app.use('/', express.static(path.resolve(__dirname, '../')));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const corsApp = express();
corsApp.use('/proxy', proxy());
corsApp.use('/cors', cors(), express.static(path.resolve(__dirname, '../')));
corsApp.use('/', express.static(path.resolve(__dirname, '.')));
corsApp.listen(CORS_PORT, () => {
    console.log(`CORS server running on port ${CORS_PORT}`);
});
