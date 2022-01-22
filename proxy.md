---
title: "Proxy"
description: "Browse different proxies available for supporting CORS content"
---

html2canvas does not get around content policy restrictions set by your browser. Drawing images that reside outside of 
the origin of the current page taint the canvas that they are drawn upon. If the canvas gets tainted, 
it cannot be read anymore. If you wish to load images that reside outside of your pages origin, you can use a proxy to load the images.

## Available proxies

 - [node.js](https://github.com/niklasvh/html2canvas-proxy-nodejs)
