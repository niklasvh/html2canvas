# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# [1.0.0-rc.3](https://github.com/niklasvh/html2canvas/compare/v1.0.0-rc.2...v1.0.0-rc.3) (2019-05-30)


### fix

* stack exceeding for css tokenizer (#1862) ([cbaecdca28cfaf9bd854e1b0c005cc8058208b36](https://github.com/niklasvh/html2canvas/commit/cbaecdca28cfaf9bd854e1b0c005cc8058208b36)), closes [#1862](https://github.com/niklasvh/html2canvas/issues/1862)
* typescript options type definition (#1861) ([cae44a6f0a6649bd8a7c4250a20792bb5c2e5b42](https://github.com/niklasvh/html2canvas/commit/cae44a6f0a6649bd8a7c4250a20792bb5c2e5b42)), closes [#1861](https://github.com/niklasvh/html2canvas/issues/1861)



# [1.0.0-rc.2](https://github.com/niklasvh/html2canvas/compare/v1.0.0-rc.1...v1.0.0-rc.2) (2019-05-29)


### ci

* refactor browser tests (#1804) ([a7d881019bfe1fd6404c341ca1c6fa69e0274ef5](https://github.com/niklasvh/html2canvas/commit/a7d881019bfe1fd6404c341ca1c6fa69e0274ef5)), closes [#1804](https://github.com/niklasvh/html2canvas/issues/1804)

### docs

* fix README documentation ([20a797cbeb21baca4ce5b9a0642a5959cdf94a51](https://github.com/niklasvh/html2canvas/commit/20a797cbeb21baca4ce5b9a0642a5959cdf94a51))
* remove dead donation link (fix #1802) ([43058241b420a5dabe94b0a4e4f6534d16a75ec0](https://github.com/niklasvh/html2canvas/commit/43058241b420a5dabe94b0a4e4f6534d16a75ec0)), closes [#1802](https://github.com/niklasvh/html2canvas/issues/1802)

### fix

* multi token overflow #1850 (#1851) ([409674fba6f8038eb174b9c89360ef8b342971e9](https://github.com/niklasvh/html2canvas/commit/409674fba6f8038eb174b9c89360ef8b342971e9)), closes [#1850](https://github.com/niklasvh/html2canvas/issues/1850) [#1851](https://github.com/niklasvh/html2canvas/issues/1851)

### test

* include reftests previewer with docs website (#1799) ([cdc4ca8296570bf842e937c6fb7cc32a1ce2bc09](https://github.com/niklasvh/html2canvas/commit/cdc4ca8296570bf842e937c6fb7cc32a1ce2bc09)), closes [#1799](https://github.com/niklasvh/html2canvas/issues/1799)



# [1.0.0-rc.1](https://github.com/niklasvh/html2canvas/compare/v1.0.0-rc.0...v1.0.0-rc.1) (2019-04-10)


### ci

* add ios simulator tests (#1794) ([a63cb3c0f132b1af915d9ef55a4c174f6e5502ce](https://github.com/niklasvh/html2canvas/commit/a63cb3c0f132b1af915d9ef55a4c174f6e5502ce)), closes [#1794](https://github.com/niklasvh/html2canvas/issues/1794)

### docs

* fix release date in changelog ([238de790a9f223becbc8726633c0f2a2dabf2cb7](https://github.com/niklasvh/html2canvas/commit/238de790a9f223becbc8726633c0f2a2dabf2cb7))
* remove invalid `async` option from docs (fix #1769) (#1796) ([7775d3c0d6f3efca00611bedd5fc9200689a9f7a](https://github.com/niklasvh/html2canvas/commit/7775d3c0d6f3efca00611bedd5fc9200689a9f7a)), closes [#1769](https://github.com/niklasvh/html2canvas/issues/1769) [#1796](https://github.com/niklasvh/html2canvas/issues/1796)

### fix

* context scale for high resolution displays with foreignobjectrendering  (#1782) ([7027900f4993dcd00745a4db045ed1c0e3255f8a](https://github.com/niklasvh/html2canvas/commit/7027900f4993dcd00745a4db045ed1c0e3255f8a)), closes [#1782](https://github.com/niklasvh/html2canvas/issues/1782)
* don't apply text shadows on elements (#1795) ([397595afb59ee50f0d128abb5945b5b9ddc6650d](https://github.com/niklasvh/html2canvas/commit/397595afb59ee50f0d128abb5945b5b9ddc6650d)), closes [#1795](https://github.com/niklasvh/html2canvas/issues/1795)
* safari data url taints (#1797) ([4e4a231683904dfdc1f82472ece5a160a158dbb8](https://github.com/niklasvh/html2canvas/commit/4e4a231683904dfdc1f82472ece5a160a158dbb8)), closes [#1797](https://github.com/niklasvh/html2canvas/issues/1797)

### test

* fix RefTestRenderer.js inclusion with karma ([49f87fb680dbfe1898b3aeb60f2f5c3a93bfbe6d](https://github.com/niklasvh/html2canvas/commit/49f87fb680dbfe1898b3aeb60f2f5c3a93bfbe6d))



# [1.0.0-rc.0](https://github.com/niklasvh/html2canvas/compare/v1.0.0-alpha.12...v1.0.0-rc.0) (2019-04-07)


### build

* update webpack and babel (#1793) ([44f3d79f68836624c2673a86f9ad47c17ef843c3](https://github.com/niklasvh/html2canvas/commit/44f3d79f68836624c2673a86f9ad47c17ef843c3)), closes [#1793](https://github.com/niklasvh/html2canvas/issues/1793)

### ci

* automate changelog generation (#1792) ([7ebef72e927eaafd34a1792ece431d2a73109230](https://github.com/niklasvh/html2canvas/commit/7ebef72e927eaafd34a1792ece431d2a73109230)), closes [#1792](https://github.com/niklasvh/html2canvas/issues/1792)
* Improve CI pipeline (#1790) ([c45ef099fe8f7142e174f4fce39448a370a987d5](https://github.com/niklasvh/html2canvas/commit/c45ef099fe8f7142e174f4fce39448a370a987d5)), closes [#1790](https://github.com/niklasvh/html2canvas/issues/1790)

### docs

* improve canvas size limit documentation (#1576) ([3212184146b33c3564c2f416e1bfda911737c38b](https://github.com/niklasvh/html2canvas/commit/3212184146b33c3564c2f416e1bfda911737c38b)), closes [#1576](https://github.com/niklasvh/html2canvas/issues/1576)

### fix

* enforce colorstop min 0 (#1743) ([349bbf137abd83464e074db3948fc79a541c2ef3](https://github.com/niklasvh/html2canvas/commit/349bbf137abd83464e074db3948fc79a541c2ef3)), closes [#1743](https://github.com/niklasvh/html2canvas/issues/1743)
* prevent unhandled promise rejections for hidden frames (#1762) ([5cbe5db35155e3a9790a30de09feb17843053b7a](https://github.com/niklasvh/html2canvas/commit/5cbe5db35155e3a9790a30de09feb17843053b7a)), closes [#1762](https://github.com/niklasvh/html2canvas/issues/1762)
* wrap .sheet.cssRules access in try...catch. (#1693) ([2c018d19875ced30caafdc40f84ca531de6e6f91](https://github.com/niklasvh/html2canvas/commit/2c018d19875ced30caafdc40f84ca531de6e6f91)), closes [#1693](https://github.com/niklasvh/html2canvas/issues/1693)



# [1.0.0-alpha.12](https://github.com/niklasvh/html2canvas/compare/v1.0.0-alpha.12...v1.0.0-alpha.13) (2018-04-05)
 * Fix white space appearing on element rendering (Fix #1438)
 * Reset canvas transform on finish (Fix #1494)

# v1.0.0-alpha.11 - 1.4.2018 
 * Fix IE11 member not found error 
 * Support blob image resources in non-foreignObjectRendering mode

# v1.0.0-alpha.10 - 15.2.2018 
 * Re-introduce `onclone` option (Fix #1434)
 * Add `ignoreElements` predicate function option
 * Fix version console logging

# v1.0.0-alpha.9 - 7.1.2018 
 * Fix dynamic style sheets
 * Fix > 50% border-radius values

# v1.0.0-alpha.8 - 2.1.2018
 * Use correct doctype in cloned Document (Fix #1298)
 * Fix individual border rendering (Fix #1349)

# v1.0.0-alpha.7 - 31.12.2017
 * Fix form input rendering (#1338)
 * Improve word line breaking algorithm

# v1.0.0-alpha.6 - 28.12.2017 
 * Fix list-style: none (#1340)
 * Extend supported values for pseudo element content

# v1.0.0-alpha.5 - 21.12.2017
 * Fix underline positioning
 * Fix canvas rendering on Chrome
 * Fix overflow: auto
 * Added support for rendering list-style

 v1.0.0-alpha.4 - 12.12.2017 
 * Fix rendering with multiple fonts defined (Fix #796)
 * Add support for radial-gradients
 * Fix logging option (#1302)
 * Add support for rendering webgl canvas content (#646)
 * Fix external SVG loading with proxies (#802)

# v1.0.0-alpha.3 - 9.12.2017
 * Disable `foreignObjectRendering` by default (#1295)
 * Fix background-size when using background-origin and background-size: cover/contain (#1299)
 * Added support for background-origin: content-box (#1299)

# v1.0.0-alpha.2 - 7.12.2017
 * Fix scroll positions for CanvasRenderer (#1259)
 * Fix `data-html2canvas-ignore` attribute (#1253)
 * Fix decimal `letter-spacing` values (#1293)

# v1.0.0-alpha.1 - 5.12.2017
 * Complete rewrite of library
 ##### Breaking Changes #####
 * Remove deprecated onrendered callback, calling `html2canvas` returns a `Promise<HTMLCanvasElement>`
 * Removed option `type`, same results can be achieved by assigning `x`, `y`, `scrollX`, `scrollY`, `width` and `height` properties.
 
 ## New featues / fixes 
 * Add support for scaling canvas (defaults to device pixel ratio)
 * Add support for multiple text-shadows
 * Add support for multiple text-decorations
 * Add support for text-decoration-color
 * Add support for percentage values for border-radius
 * Correctly handle px and percentage values in linear-gradients
 * Correctly support all angle types for linear-gradients
 * Add support for multiple values for background-repeat, background-position and background-size
 
# v0.5.0-beta4 - 23.1.2016
 * Fix logger requiring access to window object
 * Derequire browserify build
 * Fix rendering of specific elements when window is scrolled and `type` isn't set to `view`

# v0.5.0-beta3 - 6.12.2015
 * Handle color names in linear gradients

# v0.5.0-beta2 - 20.10.2015
 * Remove Promise polyfill (use native or provide it yourself)

# v0.5.0-beta1 - 19.10.2015
 * Fix bug with unmatched color stops in gradients
 * Fix scrolling issues with iOS
 * Correctly handle named colors in gradients
 * Accept matrix3d transforms
 * Fix transparent colors breaking gradients
 * Preserve scrolling positions on render

# v0.5.0-alpha2 - 3.2.2015 
 * Switch to using browserify for building
 * Fix (#517) Chrome stretches background images with 'auto' or single attributes

# v0.5.0-alpha - 19.1.2015 
 * Complete rewrite of library
 * Switched interface to return Promise
 * Uses hidden iframe window to perform rendering, allowing async rendering and doesn't force the viewport to be scrolled to the top anymore.
 * Better support for unicode
 * Checkbox/radio button rendering
 * SVG rendering
 * iframe rendering
 * Changed format for proxy requests, permitting binary responses with CORS headers as well
 * Fixed many layering issues (see z-index tests)

# v0.4.1 - 7.9.2013 
 * Added support for bower
 * Improved z-index ordering
 * Basic implementation for CSS transformations
 * Fixed inline text in top element
 * Basic implementation for text-shadow

# v0.4.0 - 30.1.2013 
 * Added rendering tests with <a href="https://github.com/niklasvh/webdriver.js">webdriver</a>
 * Switched to using grunt for building
 * Removed support for IE<9, including any FlashCanvas bits
 * Support for border-radius
 * Support for multiple background images, size, and clipping
 * Support for :before and :after pseudo elements
 * Support for placeholder rendering
 * Reformatted all tests to small units to test specific features

# v0.3.4 - 26.6.2012 

* Removed (last?) jQuery dependencies (<a href="https://github.com/niklasvh/html2canvas/commit/343b86705fe163766fcf735eb0217130e4bd5b17">niklasvh</a>)
* SVG-powered rendering (<a href="https://github.com/niklasvh/html2canvas/commit/67d3e0d0f59a5a654caf71a2e3be6494ff146c75">niklasvh</a>)
* Radial gradients (<a href="https://github.com/niklasvh/html2canvas/commit/4f22c18043a73c0c3bbf3b5e4d62714c56acd3c7">SunboX</a>)
* Split renderers to their own objects (<a href="https://github.com/niklasvh/html2canvas/commit/94f2f799a457cd29a21cc56ef8c06f1697866739">niklasvh</a>)
* Simplified API, cleaned up code (<a href="https://github.com/niklasvh/html2canvas/commit/c7d526c9eaa6a4abf4754d205fe1dee360c7660e">niklasvh</a>)

# v0.3.3 - 2.3.2012

* SVG taint fix, and additional taint testing options for rendering (<a href="https://github.com/niklasvh/html2canvas/commit/2dc8b9385e656696cb019d615bdfa1d98b17d5d4">niklasvh</a>)
* Added support for CORS images and option to create canvas as tainted (<a href="https://github.com/niklasvh/html2canvas/commit/3ad49efa0032cde25c6ed32a39e35d1505d3b2ef">niklasvh</a>)
* Improved minification saved ~1K! (<a href="https://github.com/cobexer/html2canvas/commit/b82be022b2b9240bd503e078ac980bde2b953e43">cobexer</a>)
* Added integrated support for Flashcanvas (<a href="https://github.com/niklasvh/html2canvas/commit/e9257191519f67d74fd5e364d8dee3c0963ba5fc">niklasvh</a>)
* Fixed a variety of legacy IE bugs (<a href="https://github.com/niklasvh/html2canvas/commit/b65357c55d0701017bafcd357bc654b54d458f8f">niklasvh</a>)

# v0.3.2 - 20.2.2012

* Added changelog!
* Added bookmarklet (<a href="https://github.com/niklasvh/html2canvas/commit/b320dd306e1a2d32a3bc5a71b6ebf6d8c060cde5">cobexer</a>)
* Option to select single element to render (<a href="https://github.com/niklasvh/html2canvas/commit/0cb252ada91c84ef411288b317c03e97da1f12ad">niklasvh</a>)
* Fixed closure compiler warnings (<a href="https://github.com/niklasvh/html2canvas/commit/36ff1ec7aadcbdf66851a0b77f0b9e87e4a8e4a1">cobexer</a>)
* Enable profiling in FF (<a href="https://github.com/niklasvh/html2canvas/commit/bbd75286a8406cf9e5aea01fdb7950d547edefb9">cobexer</a>)
