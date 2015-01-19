html2canvas
===========

[Homepage](http://html2canvas.hertzen.com) | [Downloads](https://github.com/niklasvh/html2canvas/releases) | [Questions](http://stackoverflow.com/questions/tagged/html2canvas?sort=newest) | [Donate](https://www.gittip.com/niklasvh/)

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/niklasvh/html2canvas?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) [![Build Status](https://travis-ci.org/niklasvh/html2canvas.png)](https://travis-ci.org/niklasvh/html2canvas)

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

Install Grunt and uglifyjs:

    $ npm install -g grunt-cli uglify-js

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
