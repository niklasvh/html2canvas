---
title: "Configuration"
---

These are all of the available configuration options.

| Name          | Type          | Default  | Description |
| ------------- |:-------------:| :------: | ----------- |
| async | Boolean | `true` | Whether to parse and render the element asynchronously
| allowTaint | Boolean | `false` | Whether to allow cross-origin images to taint the canvas
| backgroundColor | String | `#ffffff` | Canvas background color, if none is specified in DOM. Set undefined for transparent
| canvas | `HTMLCanvasElement` | `null` | Existing `canvas` element to use as a base for drawing on
| foreignObjectRendering | Boolean | `false` | Whether to use ForeignObject rendering if the browser supports it
| imageTimeout | Number | `15000` | Timeout for loading an image (in milliseconds). Set to `0` to disable timeout.
| proxy | String | `null` | Url to the [proxy](/proxy/) which is to be used for loading cross-origin images. If left empty, cross-origin images won't be loaded.
| removeContainer | Boolean | `true` | Whether to cleanup the cloned DOM elements html2canvas creates temporarily
| scale | Number | `window.devicePixelRatio` | The scale to use for rendering. Defaults to the browsers device pixel ratio.
| width | Number | `Element` width | The width of the `canvas`
| height | Number | `Element` height | The height of the `canvas`
| x | Number | `Element` x-offset | Crop canvas x-coordinate
| y | Number | `Element` y-offset| Crop canvas y-coordinate
| scrollX | Number | `Element` scrollX | The x-scroll position to used when rendering element, (for example if the Element uses `position: fixed`)
| scrollY | Number | `Element` scrollY | The y-scroll position to used when rendering element, (for example if the Element uses `position: fixed`)
| windowWidth | Number | `Window.innerWidth` | Window width to use when rendering `Element`, which may affect things like Media queries
| windowHeight | Number | `Window.innerHeight` | Window height to use when rendering `Element`, which may affect things like Media queries
