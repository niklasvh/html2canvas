---
title: "FAQ"
description: "Explore Frequently Asked Questions regarding html2canvas"
---

## Why aren't my images rendered?
html2canvas does not get around content policy restrictions set by your browser. Drawing images that reside outside of 
the [origin](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) of the current page [taint the 
canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image#What_is_a_tainted_canvas) that they are drawn upon. If the canvas gets tainted, it cannot be read anymore. As such, html2canvas implements 
methods to check whether an image would taint the canvas before applying it. If you have set the `allowTaint` 
[option](/configuration) to `false`, it will not draw the image.

If you wish to load images that reside outside of your pages origin, you can use a [proxy](/proxy) to load the images.

## Why is the produced canvas empty or cuts off half way through?
Make sure that `canvas` element doesn't hit [browser limitations](https://stackoverflow.com/questions/6081483/maximum-size-of-a-canvas-element) for the `canvas` size or use the window configuration options to set a custom window size based on the `canvas` element:
```
await html2canvas(element, {
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight
});
```
The window limitations vary by browser, operating system and system hardware.

### Chrome
> Maximum height/width: 32,767 pixels
> Maximum area: 268,435,456 pixels (e.g., 16,384 x 16,384)

### Firefox
> Maximum height/width: 32,767 pixels
> Maximum area: 472,907,776 pixels (e.g., 22,528 x 20,992)

### Internet Explorer
> Maximum height/width: 8,192 pixels
> Maximum area: N/A

### iOS
> The maximum size for a canvas element is 3 megapixels for devices with less than 256 MB RAM and 5 megapixels for devices with greater or equal than 256 MB RAM

## Why doesn't CSS property X render correctly or only partially?
As each CSS property needs to be manually coded to render correctly, html2canvas will *never* have full CSS support. 
The library tries to support the most [commonly used CSS properties](/features) to the extent that it can. If some CSS property 
is missing or incomplete and you feel that it should be part of the library, create test cases for it and a new issue for it.

## How do I get html2canvas to work in a browser extension?
You shouldn't use html2canvas in a browser extension. Most browsers have native support for capturing screenshots from 
tabs within extensions. Relevant information for [Chrome](https://developer.chrome.com/extensions/tabs#method-captureVisibleTab) and 
[Firefox](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D#drawWindow()).
