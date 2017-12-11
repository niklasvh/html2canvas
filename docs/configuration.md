---
title: "Configuration"
description: "Explore the different configuration options available for html2canvas"
previousUrl: "/getting-started"
previousTitle: "Getting Started"
nextUrl: "/features"
nextTitle: "Features"
---

These are all of the available configuration options.

| Name          | Default  | Description |
| ------------- | :------: | ----------- |
| async | `true` | Whether to parse and render the element asynchronously
| allowTaint | `false` | Whether to allow cross-origin images to taint the canvas
| backgroundColor | `#ffffff` | Canvas background color, if none is specified in DOM. Set undefined for transparent
| canvas | `null` | Existing `canvas` element to use as a base for drawing on
| foreignObjectRendering | `false` | Whether to use ForeignObject rendering if the browser supports it
| imageTimeout | `15000` | Timeout for loading an image (in milliseconds). Set to `0` to disable timeout.
| logging | `true` | Enable logging for debug purposes
| proxy | `null` | Url to the [proxy](/proxy/) which is to be used for loading cross-origin images. If left empty, cross-origin images won't be loaded.
| removeContainer | `true` | Whether to cleanup the cloned DOM elements html2canvas creates temporarily
| scale | `window.devicePixelRatio` | The scale to use for rendering. Defaults to the browsers device pixel ratio.
| width | `Element` width | The width of the `canvas`
| height | `Element` height | The height of the `canvas`
| x | `Element` x-offset | Crop canvas x-coordinate
| y | `Element` y-offset| Crop canvas y-coordinate
| scrollX | `Element` scrollX | The x-scroll position to used when rendering element, (for example if the Element uses `position: fixed`)
| scrollY | `Element` scrollY | The y-scroll position to used when rendering element, (for example if the Element uses `position: fixed`)
| windowWidth | `Window.innerWidth` | Window width to use when rendering `Element`, which may affect things like Media queries
| windowHeight | `Window.innerHeight` | Window height to use when rendering `Element`, which may affect things like Media queries
