---
title: "Getting Started"
description: "Learn how to start using html2canvas"
previousUrl: "/documentation"
previousTitle: "About"
nextUrl: "/configuration"
nextTitle: "Configuration"
---

## Installing

You can install `html2canvas` through npm or [download a built release](https://github.com/niklasvh/html2canvas/releases).

### npm

    npm install html2canvas

```javascript
import html2canvas from 'html2canvas';
```
    
## Usage

To render an `element` with html2canvas with some (optional) [options](/configuration/), simply call `html2canvas(element, options);`

```javascript
html2canvas(document.body).then(function(canvas) {
    document.body.appendChild(canvas);
});
```
