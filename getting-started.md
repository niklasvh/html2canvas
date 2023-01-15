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
##cdn
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.js" integrity="sha512-sn/GHTj+FCxK5wam7k9w4gPPm6zss4Zwl/X9wgrvGMFbnedR8lTUSLdsolDRBRzsX6N+YgG6OWyvn9qaFVXH9w==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
```
## Usage

To render an `element` with html2canvas with some (optional) [options](/configuration/), simply call `html2canvas(element, options);`

```javascript
html2canvas(document.body).then(function(canvas) {
    document.body.appendChild(canvas);
});
```
