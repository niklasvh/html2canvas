### Changelog ###

v0.5.0-beta4 - 23.1.2016
 * Fix logger requiring access to window object
 * Derequire browserify build
 * Fix rendering of specific elements when window is scrolled and `type` isn't set to `view`

v0.5.0-beta3 - 6.12.2015
 * Handle color names in linear gradients

v0.5.0-beta2 - 20.10.2015
 * Remove Promise polyfill (use native or provide it yourself)

v0.5.0-beta1 - 19.10.2015
 * Fix bug with unmatched color stops in gradients
 * Fix scrolling issues with iOS
 * Correctly handle named colors in gradients
 * Accept matrix3d transforms
 * Fix transparent colors breaking gradients
 * Preserve scrolling positions on render

v0.5.0-alpha2 - 3.2.2015
 * Switch to using browserify for building
 * Fix (#517) Chrome stretches background images with 'auto' or single attributes

v0.5.0-alpha - 19.1.2015
 * Complete rewrite of library
 * Switched interface to return Promise
 * Uses hidden iframe window to perform rendering, allowing async rendering and doesn't force the viewport to be scrolled to the top anymore.
 * Better support for unicode
 * Checkbox/radio button rendering
 * SVG rendering
 * iframe rendering
 * Changed format for proxy requests, permitting binary responses with CORS headers as well
 * Fixed many layering issues (see z-index tests)

v0.4.1 - 7.9.2013
 * Added support for bower
 * Improved z-index ordering
 * Basic implementation for CSS transformations
 * Fixed inline text in top element
 * Basic implementation for text-shadow

v0.4.0 - 30.1.2013
 * Added rendering tests with <a href="https://github.com/niklasvh/webdriver.js">webdriver</a>
 * Switched to using grunt for building
 * Removed support for IE<9, including any FlashCanvas bits
 * Support for border-radius
 * Support for multiple background images, size, and clipping
 * Support for :before and :after pseudo elements
 * Support for placeholder rendering
 * Reformatted all tests to small units to test specific features

v0.3.4 - 26.6.2012

* Removed (last?) jQuery dependencies (<a href="https://github.com/niklasvh/html2canvas/commit/343b86705fe163766fcf735eb0217130e4bd5b17">niklasvh</a>)
* SVG-powered rendering (<a href="https://github.com/niklasvh/html2canvas/commit/67d3e0d0f59a5a654caf71a2e3be6494ff146c75">niklasvh</a>)
* Radial gradients (<a href="https://github.com/niklasvh/html2canvas/commit/4f22c18043a73c0c3bbf3b5e4d62714c56acd3c7">SunboX</a>)
* Split renderers to their own objects (<a href="https://github.com/niklasvh/html2canvas/commit/94f2f799a457cd29a21cc56ef8c06f1697866739">niklasvh</a>)
* Simplified API, cleaned up code (<a href="https://github.com/niklasvh/html2canvas/commit/c7d526c9eaa6a4abf4754d205fe1dee360c7660e">niklasvh</a>)

v0.3.3 - 2.3.2012

* SVG taint fix, and additional taint testing options for rendering (<a href="https://github.com/niklasvh/html2canvas/commit/2dc8b9385e656696cb019d615bdfa1d98b17d5d4">niklasvh</a>)
* Added support for CORS images and option to create canvas as tainted (<a href="https://github.com/niklasvh/html2canvas/commit/3ad49efa0032cde25c6ed32a39e35d1505d3b2ef">niklasvh</a>)
* Improved minification saved ~1K! (<a href="https://github.com/cobexer/html2canvas/commit/b82be022b2b9240bd503e078ac980bde2b953e43">cobexer</a>)
* Added integrated support for Flashcanvas (<a href="https://github.com/niklasvh/html2canvas/commit/e9257191519f67d74fd5e364d8dee3c0963ba5fc">niklasvh</a>)
* Fixed a variety of legacy IE bugs (<a href="https://github.com/niklasvh/html2canvas/commit/b65357c55d0701017bafcd357bc654b54d458f8f">niklasvh</a>)

v0.3.2 - 20.2.2012

* Added changelog!
* Added bookmarklet (<a href="https://github.com/niklasvh/html2canvas/commit/b320dd306e1a2d32a3bc5a71b6ebf6d8c060cde5">cobexer</a>)
* Option to select single element to render (<a href="https://github.com/niklasvh/html2canvas/commit/0cb252ada91c84ef411288b317c03e97da1f12ad">niklasvh</a>)
* Fixed closure compiler warnings (<a href="https://github.com/niklasvh/html2canvas/commit/36ff1ec7aadcbdf66851a0b77f0b9e87e4a8e4a1">cobexer</a>)
* Enable profiling in FF (<a href="https://github.com/niklasvh/html2canvas/commit/bbd75286a8406cf9e5aea01fdb7950d547edefb9">cobexer</a>)
