html2canvas
===========

[Homepage](http://html2canvas.hertzen.com) | [Downloads](https://github.com/niklasvh/html2canvas/releases) | [Questions](http://stackoverflow.com/questions/tagged/html2canvas?sort=newest) | [Donate](https://www.gittip.com/niklasvh/)

### Current build status ###
[![Build Status](https://travis-ci.org/niklasvh/html2canvas.png)](https://travis-ci.org/niklasvh/html2canvas)

#### JavaScript HTML renderer ####

 The script allows you to take "screenshots" of webpages or parts of it, directly on the users browser. The screenshot is based on the DOM and as such may not be 100% accurate to the real representation as it does not make an actual screenshot, but builds the screenshot based on the information available on the page.


###How does it work?###
The script renders the current page as a canvas image, by reading the DOM and the different styles applied to the elements.

It does **not require any rendering from the server**, as the whole image is created on the **clients browser**. However, as it is heavily dependent on the browser, this library is *not suitable* to be used in nodejs.
It doesn't magically circumvent any browser content policy restrictions either, so rendering cross-origin content will require a [proxy](https://github.com/niklasvh/html2canvas/wiki/Proxies) to get the content to the [same origin](http://en.wikipedia.org/wiki/Same_origin_policy).

The script is still in a **very experimental state**, so I don't recommend using it in a production environment nor start building applications with it yet, as there will be still major changes made.

###Browser compatibility###

The script should work fine on the following browsers:

* Firefox 3.5+
* Google Chrome
* Opera 12+
* IE9+
* Safari 6+

As each CSS property needs to be manually built to be supported, there are a number of properties that are not yet supported.

### Usage ###

**Note!** These instructions are for using the current dev version of 0.5, for the latest release version (0.4.1), checkout the [old readme](https://github.com/niklasvh/html2canvas/blob/v0.4/readme.md).

To render an `element` with html2canvas, simply call:
` html2canvas(element[, options]);`

The function returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) containing the `<canvas>` element. Simply add a promise fullfillment handler to the promise using `then`:

    html2canvas(document.body).then(function(canvas) {
        document.body.appendChild(canvas);
    });

### Building ###

The library uses [grunt](http://gruntjs.com/) for building. Alternatively, you can download the latest build from [here](https://github.com/niklasvh/html2canvas/blob/master/dist/html2canvas.js).

Clone git repository with submodules:

    $ git clone --recursive git://github.com/niklasvh/html2canvas.git

Run the full build process (including lint, qunit and webdriver tests):

    $ grunt

Skip lint and tests and simply build from source:

    $ grunt build

### Running tests ###

The library has two sets of tests. The first set is a number of qunit tests that check that different values parsed by browsers are correctly converted in html2canvas. To run these tests with grunt you'll need [phantomjs](http://phantomjs.org/).

The other set of tests run Firefox, Chrome and Internet Explorer with [webdriver](https://github.com/niklasvh/webdriver.js). The selenium standalone server (runs on Java) is required for these tests and can be downloaded from [here](http://code.google.com/p/selenium/downloads/list). They capture an actual screenshot from the test pages and compare the image to the screenshot created by html2canvas and calculate the percentage differences. These tests generally aren't expected to provide 100% matches, but while commiting changes, these should generally not go decrease from the baseline values.

Start by downloading the dependencies:

    $ npm install

Run qunit tests:

    $ grunt test

### Examples ###

For more information and examples, please visit the [homepage](http://html2canvas.hertzen.com) or try the [test console](http://html2canvas.hertzen.com/screenshots.html).

### Contributing ###

If you wish to contribute to the project, please send the pull requests to the develop branch. Before submitting any changes, try and test that the changes work with all the support browsers. If some CSS property isn't supported or is incomplete, please create appropriate tests for it as well before submitting any code changes.

### Changelog ###

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
