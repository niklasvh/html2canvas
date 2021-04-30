/*
 * html2canvas 1.0.0-rc.7 <https://html2canvas.hertzen.com>
 * Copyright (c) 2021 Niklas von Hertzen <https://hertzen.com>
 * Released under MIT License
 */
(function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var testList = [
        "/tests/reftests/acid2.html",
        "/tests/reftests/animation.html",
        "/tests/reftests/background/box-shadow.html",
        "/tests/reftests/background/clip.html",
        "/tests/reftests/background/encoded.html",
        "/tests/reftests/background/linear-gradient.html",
        "/tests/reftests/background/linear-gradient2.html",
        "/tests/reftests/background/multi.html",
        "/tests/reftests/background/origin.html",
        "/tests/reftests/background/position.html",
        "/tests/reftests/background/radial-gradient.html",
        "/tests/reftests/background/radial-gradient2.html",
        "/tests/reftests/background/repeat.html",
        "/tests/reftests/background/size.html",
        "/tests/reftests/border/dashed.html",
        "/tests/reftests/border/dotted.html",
        "/tests/reftests/border/double.html",
        "/tests/reftests/border/inset.html",
        "/tests/reftests/border/radius.html",
        "/tests/reftests/border/solid.html",
        "/tests/reftests/clip.html",
        "/tests/reftests/crossorigin-iframe.html",
        "/tests/reftests/dynamicstyle.html",
        "/tests/reftests/forms.html",
        "/tests/reftests/iframe.html",
        "/tests/reftests/images/base.html",
        "/tests/reftests/images/canvas.html",
        "/tests/reftests/images/cross-origin.html",
        "/tests/reftests/images/doctype.html",
        "/tests/reftests/images/empty.html",
        "/tests/reftests/images/images.html",
        "/tests/reftests/images/svg/base64.html",
        "/tests/reftests/images/svg/external.html",
        "/tests/reftests/images/svg/inline.html",
        "/tests/reftests/images/svg/native_only.html",
        "/tests/reftests/images/svg/node.html",
        "/tests/reftests/list/decimal-leading-zero.html",
        "/tests/reftests/list/decimal.html",
        "/tests/reftests/list/liststyle.html",
        "/tests/reftests/list/lower-alpha.html",
        "/tests/reftests/list/upper-roman.html",
        "/tests/reftests/options/crop.html",
        "/tests/reftests/options/element.html",
        "/tests/reftests/options/ignore.html",
        "/tests/reftests/options/onclone.html",
        "/tests/reftests/options/scroll.html",
        "/tests/reftests/overflow/overflow-transform.html",
        "/tests/reftests/overflow/overflow.html",
        "/tests/reftests/pseudo-content.html",
        "/tests/reftests/pseudoelements.html",
        "/tests/reftests/text/child-textnodes.html",
        "/tests/reftests/text/chinese.html",
        "/tests/reftests/text/fontawesome.html",
        "/tests/reftests/text/line-break.html",
        "/tests/reftests/text/linethrough.html",
        "/tests/reftests/text/multiple.html",
        "/tests/reftests/text/overflow-wrap.html",
        "/tests/reftests/text/shadow.html",
        "/tests/reftests/text/text.html",
        "/tests/reftests/text/thai.html",
        "/tests/reftests/text/underline-lineheight.html",
        "/tests/reftests/text/underline.html",
        "/tests/reftests/text/word-break.html",
        "/tests/reftests/transform/nested.html",
        "/tests/reftests/transform/rotate.html",
        "/tests/reftests/transform/translate.html",
        "/tests/reftests/visibility.html",
        "/tests/reftests/zindex/z-index1.html",
        "/tests/reftests/zindex/z-index10.html",
        "/tests/reftests/zindex/z-index11.html",
        "/tests/reftests/zindex/z-index12.html",
        "/tests/reftests/zindex/z-index13.html",
        "/tests/reftests/zindex/z-index14.html",
        "/tests/reftests/zindex/z-index15.html",
        "/tests/reftests/zindex/z-index16.html",
        "/tests/reftests/zindex/z-index17.html",
        "/tests/reftests/zindex/z-index18.html",
        "/tests/reftests/zindex/z-index19.html",
        "/tests/reftests/zindex/z-index2.html",
        "/tests/reftests/zindex/z-index20.html",
        "/tests/reftests/zindex/z-index3.html",
        "/tests/reftests/zindex/z-index4.html",
        "/tests/reftests/zindex/z-index5.html",
        "/tests/reftests/zindex/z-index6.html",
        "/tests/reftests/zindex/z-index7.html",
        "/tests/reftests/zindex/z-index8.html",
        "/tests/reftests/zindex/z-index9.html"
    ];
    var ignoredTests = {};

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var platform = createCommonjsModule(function (module, exports) {
    (function() {

      /** Used to determine if values are of the language type `Object`. */
      var objectTypes = {
        'function': true,
        'object': true
      };

      /** Used as a reference to the global object. */
      var root = (objectTypes[typeof window] && window) || this;

      /** Backup possible global object. */
      var oldRoot = root;

      /** Detect free variable `exports`. */
      var freeExports = exports;

      /** Detect free variable `module`. */
      var freeModule = module && !module.nodeType && module;

      /** Detect free variable `global` from Node.js or Browserified code and use it as `root`. */
      var freeGlobal = freeExports && freeModule && typeof commonjsGlobal == 'object' && commonjsGlobal;
      if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
        root = freeGlobal;
      }

      /**
       * Used as the maximum length of an array-like object.
       * See the [ES6 spec](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength)
       * for more details.
       */
      var maxSafeInteger = Math.pow(2, 53) - 1;

      /** Regular expression to detect Opera. */
      var reOpera = /\bOpera/;

      /** Possible global object. */
      var thisBinding = this;

      /** Used for native method references. */
      var objectProto = Object.prototype;

      /** Used to check for own properties of an object. */
      var hasOwnProperty = objectProto.hasOwnProperty;

      /** Used to resolve the internal `[[Class]]` of values. */
      var toString = objectProto.toString;

      /*--------------------------------------------------------------------------*/

      /**
       * Capitalizes a string value.
       *
       * @private
       * @param {string} string The string to capitalize.
       * @returns {string} The capitalized string.
       */
      function capitalize(string) {
        string = String(string);
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

      /**
       * A utility function to clean up the OS name.
       *
       * @private
       * @param {string} os The OS name to clean up.
       * @param {string} [pattern] A `RegExp` pattern matching the OS name.
       * @param {string} [label] A label for the OS.
       */
      function cleanupOS(os, pattern, label) {
        // Platform tokens are defined at:
        // http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
        // http://web.archive.org/web/20081122053950/http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
        var data = {
          '10.0': '10',
          '6.4':  '10 Technical Preview',
          '6.3':  '8.1',
          '6.2':  '8',
          '6.1':  'Server 2008 R2 / 7',
          '6.0':  'Server 2008 / Vista',
          '5.2':  'Server 2003 / XP 64-bit',
          '5.1':  'XP',
          '5.01': '2000 SP1',
          '5.0':  '2000',
          '4.0':  'NT',
          '4.90': 'ME'
        };
        // Detect Windows version from platform tokens.
        if (pattern && label && /^Win/i.test(os) && !/^Windows Phone /i.test(os) &&
            (data = data[/[\d.]+$/.exec(os)])) {
          os = 'Windows ' + data;
        }
        // Correct character case and cleanup string.
        os = String(os);

        if (pattern && label) {
          os = os.replace(RegExp(pattern, 'i'), label);
        }

        os = format(
          os.replace(/ ce$/i, ' CE')
            .replace(/\bhpw/i, 'web')
            .replace(/\bMacintosh\b/, 'Mac OS')
            .replace(/_PowerPC\b/i, ' OS')
            .replace(/\b(OS X) [^ \d]+/i, '$1')
            .replace(/\bMac (OS X)\b/, '$1')
            .replace(/\/(\d)/, ' $1')
            .replace(/_/g, '.')
            .replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, '')
            .replace(/\bx86\.64\b/gi, 'x86_64')
            .replace(/\b(Windows Phone) OS\b/, '$1')
            .replace(/\b(Chrome OS \w+) [\d.]+\b/, '$1')
            .split(' on ')[0]
        );

        return os;
      }

      /**
       * An iteration utility for arrays and objects.
       *
       * @private
       * @param {Array|Object} object The object to iterate over.
       * @param {Function} callback The function called per iteration.
       */
      function each(object, callback) {
        var index = -1,
            length = object ? object.length : 0;

        if (typeof length == 'number' && length > -1 && length <= maxSafeInteger) {
          while (++index < length) {
            callback(object[index], index, object);
          }
        } else {
          forOwn(object, callback);
        }
      }

      /**
       * Trim and conditionally capitalize string values.
       *
       * @private
       * @param {string} string The string to format.
       * @returns {string} The formatted string.
       */
      function format(string) {
        string = trim(string);
        return /^(?:webOS|i(?:OS|P))/.test(string)
          ? string
          : capitalize(string);
      }

      /**
       * Iterates over an object's own properties, executing the `callback` for each.
       *
       * @private
       * @param {Object} object The object to iterate over.
       * @param {Function} callback The function executed per own property.
       */
      function forOwn(object, callback) {
        for (var key in object) {
          if (hasOwnProperty.call(object, key)) {
            callback(object[key], key, object);
          }
        }
      }

      /**
       * Gets the internal `[[Class]]` of a value.
       *
       * @private
       * @param {*} value The value.
       * @returns {string} The `[[Class]]`.
       */
      function getClassOf(value) {
        return value == null
          ? capitalize(value)
          : toString.call(value).slice(8, -1);
      }

      /**
       * Host objects can return type values that are different from their actual
       * data type. The objects we are concerned with usually return non-primitive
       * types of "object", "function", or "unknown".
       *
       * @private
       * @param {*} object The owner of the property.
       * @param {string} property The property to check.
       * @returns {boolean} Returns `true` if the property value is a non-primitive, else `false`.
       */
      function isHostType(object, property) {
        var type = object != null ? typeof object[property] : 'number';
        return !/^(?:boolean|number|string|undefined)$/.test(type) &&
          (type == 'object' ? !!object[property] : true);
      }

      /**
       * Prepares a string for use in a `RegExp` by making hyphens and spaces optional.
       *
       * @private
       * @param {string} string The string to qualify.
       * @returns {string} The qualified string.
       */
      function qualify(string) {
        return String(string).replace(/([ -])(?!$)/g, '$1?');
      }

      /**
       * A bare-bones `Array#reduce` like utility function.
       *
       * @private
       * @param {Array} array The array to iterate over.
       * @param {Function} callback The function called per iteration.
       * @returns {*} The accumulated result.
       */
      function reduce(array, callback) {
        var accumulator = null;
        each(array, function(value, index) {
          accumulator = callback(accumulator, value, index, array);
        });
        return accumulator;
      }

      /**
       * Removes leading and trailing whitespace from a string.
       *
       * @private
       * @param {string} string The string to trim.
       * @returns {string} The trimmed string.
       */
      function trim(string) {
        return String(string).replace(/^ +| +$/g, '');
      }

      /*--------------------------------------------------------------------------*/

      /**
       * Creates a new platform object.
       *
       * @memberOf platform
       * @param {Object|string} [ua=navigator.userAgent] The user agent string or
       *  context object.
       * @returns {Object} A platform object.
       */
      function parse(ua) {

        /** The environment context object. */
        var context = root;

        /** Used to flag when a custom context is provided. */
        var isCustomContext = ua && typeof ua == 'object' && getClassOf(ua) != 'String';

        // Juggle arguments.
        if (isCustomContext) {
          context = ua;
          ua = null;
        }

        /** Browser navigator object. */
        var nav = context.navigator || {};

        /** Browser user agent string. */
        var userAgent = nav.userAgent || '';

        ua || (ua = userAgent);

        /** Used to flag when `thisBinding` is the [ModuleScope]. */
        var isModuleScope = isCustomContext || thisBinding == oldRoot;

        /** Used to detect if browser is like Chrome. */
        var likeChrome = isCustomContext
          ? !!nav.likeChrome
          : /\bChrome\b/.test(ua) && !/internal|\n/i.test(toString.toString());

        /** Internal `[[Class]]` value shortcuts. */
        var objectClass = 'Object',
            airRuntimeClass = isCustomContext ? objectClass : 'ScriptBridgingProxyObject',
            enviroClass = isCustomContext ? objectClass : 'Environment',
            javaClass = (isCustomContext && context.java) ? 'JavaPackage' : getClassOf(context.java),
            phantomClass = isCustomContext ? objectClass : 'RuntimeObject';

        /** Detect Java environments. */
        var java = /\bJava/.test(javaClass) && context.java;

        /** Detect Rhino. */
        var rhino = java && getClassOf(context.environment) == enviroClass;

        /** A character to represent alpha. */
        var alpha = java ? 'a' : '\u03b1';

        /** A character to represent beta. */
        var beta = java ? 'b' : '\u03b2';

        /** Browser document object. */
        var doc = context.document || {};

        /**
         * Detect Opera browser (Presto-based).
         * http://www.howtocreate.co.uk/operaStuff/operaObject.html
         * http://dev.opera.com/articles/view/opera-mini-web-content-authoring-guidelines/#operamini
         */
        var opera = context.operamini || context.opera;

        /** Opera `[[Class]]`. */
        var operaClass = reOpera.test(operaClass = (isCustomContext && opera) ? opera['[[Class]]'] : getClassOf(opera))
          ? operaClass
          : (opera = null);

        /*------------------------------------------------------------------------*/

        /** Temporary variable used over the script's lifetime. */
        var data;

        /** The CPU architecture. */
        var arch = ua;

        /** Platform description array. */
        var description = [];

        /** Platform alpha/beta indicator. */
        var prerelease = null;

        /** A flag to indicate that environment features should be used to resolve the platform. */
        var useFeatures = ua == userAgent;

        /** The browser/environment version. */
        var version = useFeatures && opera && typeof opera.version == 'function' && opera.version();

        /** A flag to indicate if the OS ends with "/ Version" */
        var isSpecialCasedOS;

        /* Detectable layout engines (order is important). */
        var layout = getLayout([
          { 'label': 'EdgeHTML', 'pattern': 'Edge' },
          'Trident',
          { 'label': 'WebKit', 'pattern': 'AppleWebKit' },
          'iCab',
          'Presto',
          'NetFront',
          'Tasman',
          'KHTML',
          'Gecko'
        ]);

        /* Detectable browser names (order is important). */
        var name = getName([
          'Adobe AIR',
          'Arora',
          'Avant Browser',
          'Breach',
          'Camino',
          'Electron',
          'Epiphany',
          'Fennec',
          'Flock',
          'Galeon',
          'GreenBrowser',
          'iCab',
          'Iceweasel',
          'K-Meleon',
          'Konqueror',
          'Lunascape',
          'Maxthon',
          { 'label': 'Microsoft Edge', 'pattern': 'Edge' },
          'Midori',
          'Nook Browser',
          'PaleMoon',
          'PhantomJS',
          'Raven',
          'Rekonq',
          'RockMelt',
          { 'label': 'Samsung Internet', 'pattern': 'SamsungBrowser' },
          'SeaMonkey',
          { 'label': 'Silk', 'pattern': '(?:Cloud9|Silk-Accelerated)' },
          'Sleipnir',
          'SlimBrowser',
          { 'label': 'SRWare Iron', 'pattern': 'Iron' },
          'Sunrise',
          'Swiftfox',
          'Waterfox',
          'WebPositive',
          'Opera Mini',
          { 'label': 'Opera Mini', 'pattern': 'OPiOS' },
          'Opera',
          { 'label': 'Opera', 'pattern': 'OPR' },
          'Chrome',
          { 'label': 'Chrome Mobile', 'pattern': '(?:CriOS|CrMo)' },
          { 'label': 'Firefox', 'pattern': '(?:Firefox|Minefield)' },
          { 'label': 'Firefox for iOS', 'pattern': 'FxiOS' },
          { 'label': 'IE', 'pattern': 'IEMobile' },
          { 'label': 'IE', 'pattern': 'MSIE' },
          'Safari'
        ]);

        /* Detectable products (order is important). */
        var product = getProduct([
          { 'label': 'BlackBerry', 'pattern': 'BB10' },
          'BlackBerry',
          { 'label': 'Galaxy S', 'pattern': 'GT-I9000' },
          { 'label': 'Galaxy S2', 'pattern': 'GT-I9100' },
          { 'label': 'Galaxy S3', 'pattern': 'GT-I9300' },
          { 'label': 'Galaxy S4', 'pattern': 'GT-I9500' },
          { 'label': 'Galaxy S5', 'pattern': 'SM-G900' },
          { 'label': 'Galaxy S6', 'pattern': 'SM-G920' },
          { 'label': 'Galaxy S6 Edge', 'pattern': 'SM-G925' },
          { 'label': 'Galaxy S7', 'pattern': 'SM-G930' },
          { 'label': 'Galaxy S7 Edge', 'pattern': 'SM-G935' },
          'Google TV',
          'Lumia',
          'iPad',
          'iPod',
          'iPhone',
          'Kindle',
          { 'label': 'Kindle Fire', 'pattern': '(?:Cloud9|Silk-Accelerated)' },
          'Nexus',
          'Nook',
          'PlayBook',
          'PlayStation Vita',
          'PlayStation',
          'TouchPad',
          'Transformer',
          { 'label': 'Wii U', 'pattern': 'WiiU' },
          'Wii',
          'Xbox One',
          { 'label': 'Xbox 360', 'pattern': 'Xbox' },
          'Xoom'
        ]);

        /* Detectable manufacturers. */
        var manufacturer = getManufacturer({
          'Apple': { 'iPad': 1, 'iPhone': 1, 'iPod': 1 },
          'Archos': {},
          'Amazon': { 'Kindle': 1, 'Kindle Fire': 1 },
          'Asus': { 'Transformer': 1 },
          'Barnes & Noble': { 'Nook': 1 },
          'BlackBerry': { 'PlayBook': 1 },
          'Google': { 'Google TV': 1, 'Nexus': 1 },
          'HP': { 'TouchPad': 1 },
          'HTC': {},
          'LG': {},
          'Microsoft': { 'Xbox': 1, 'Xbox One': 1 },
          'Motorola': { 'Xoom': 1 },
          'Nintendo': { 'Wii U': 1,  'Wii': 1 },
          'Nokia': { 'Lumia': 1 },
          'Samsung': { 'Galaxy S': 1, 'Galaxy S2': 1, 'Galaxy S3': 1, 'Galaxy S4': 1 },
          'Sony': { 'PlayStation': 1, 'PlayStation Vita': 1 }
        });

        /* Detectable operating systems (order is important). */
        var os = getOS([
          'Windows Phone',
          'Android',
          'CentOS',
          { 'label': 'Chrome OS', 'pattern': 'CrOS' },
          'Debian',
          'Fedora',
          'FreeBSD',
          'Gentoo',
          'Haiku',
          'Kubuntu',
          'Linux Mint',
          'OpenBSD',
          'Red Hat',
          'SuSE',
          'Ubuntu',
          'Xubuntu',
          'Cygwin',
          'Symbian OS',
          'hpwOS',
          'webOS ',
          'webOS',
          'Tablet OS',
          'Tizen',
          'Linux',
          'Mac OS X',
          'Macintosh',
          'Mac',
          'Windows 98;',
          'Windows '
        ]);

        /*------------------------------------------------------------------------*/

        /**
         * Picks the layout engine from an array of guesses.
         *
         * @private
         * @param {Array} guesses An array of guesses.
         * @returns {null|string} The detected layout engine.
         */
        function getLayout(guesses) {
          return reduce(guesses, function(result, guess) {
            return result || RegExp('\\b' + (
              guess.pattern || qualify(guess)
            ) + '\\b', 'i').exec(ua) && (guess.label || guess);
          });
        }

        /**
         * Picks the manufacturer from an array of guesses.
         *
         * @private
         * @param {Array} guesses An object of guesses.
         * @returns {null|string} The detected manufacturer.
         */
        function getManufacturer(guesses) {
          return reduce(guesses, function(result, value, key) {
            // Lookup the manufacturer by product or scan the UA for the manufacturer.
            return result || (
              value[product] ||
              value[/^[a-z]+(?: +[a-z]+\b)*/i.exec(product)] ||
              RegExp('\\b' + qualify(key) + '(?:\\b|\\w*\\d)', 'i').exec(ua)
            ) && key;
          });
        }

        /**
         * Picks the browser name from an array of guesses.
         *
         * @private
         * @param {Array} guesses An array of guesses.
         * @returns {null|string} The detected browser name.
         */
        function getName(guesses) {
          return reduce(guesses, function(result, guess) {
            return result || RegExp('\\b' + (
              guess.pattern || qualify(guess)
            ) + '\\b', 'i').exec(ua) && (guess.label || guess);
          });
        }

        /**
         * Picks the OS name from an array of guesses.
         *
         * @private
         * @param {Array} guesses An array of guesses.
         * @returns {null|string} The detected OS name.
         */
        function getOS(guesses) {
          return reduce(guesses, function(result, guess) {
            var pattern = guess.pattern || qualify(guess);
            if (!result && (result =
                  RegExp('\\b' + pattern + '(?:/[\\d.]+|[ \\w.]*)', 'i').exec(ua)
                )) {
              result = cleanupOS(result, pattern, guess.label || guess);
            }
            return result;
          });
        }

        /**
         * Picks the product name from an array of guesses.
         *
         * @private
         * @param {Array} guesses An array of guesses.
         * @returns {null|string} The detected product name.
         */
        function getProduct(guesses) {
          return reduce(guesses, function(result, guess) {
            var pattern = guess.pattern || qualify(guess);
            if (!result && (result =
                  RegExp('\\b' + pattern + ' *\\d+[.\\w_]*', 'i').exec(ua) ||
                  RegExp('\\b' + pattern + ' *\\w+-[\\w]*', 'i').exec(ua) ||
                  RegExp('\\b' + pattern + '(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)', 'i').exec(ua)
                )) {
              // Split by forward slash and append product version if needed.
              if ((result = String((guess.label && !RegExp(pattern, 'i').test(guess.label)) ? guess.label : result).split('/'))[1] && !/[\d.]+/.test(result[0])) {
                result[0] += ' ' + result[1];
              }
              // Correct character case and cleanup string.
              guess = guess.label || guess;
              result = format(result[0]
                .replace(RegExp(pattern, 'i'), guess)
                .replace(RegExp('; *(?:' + guess + '[_-])?', 'i'), ' ')
                .replace(RegExp('(' + guess + ')[-_.]?(\\w)', 'i'), '$1 $2'));
            }
            return result;
          });
        }

        /**
         * Resolves the version using an array of UA patterns.
         *
         * @private
         * @param {Array} patterns An array of UA patterns.
         * @returns {null|string} The detected version.
         */
        function getVersion(patterns) {
          return reduce(patterns, function(result, pattern) {
            return result || (RegExp(pattern +
              '(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)', 'i').exec(ua) || 0)[1] || null;
          });
        }

        /**
         * Returns `platform.description` when the platform object is coerced to a string.
         *
         * @name toString
         * @memberOf platform
         * @returns {string} Returns `platform.description` if available, else an empty string.
         */
        function toStringPlatform() {
          return this.description || '';
        }

        /*------------------------------------------------------------------------*/

        // Convert layout to an array so we can add extra details.
        layout && (layout = [layout]);

        // Detect product names that contain their manufacturer's name.
        if (manufacturer && !product) {
          product = getProduct([manufacturer]);
        }
        // Clean up Google TV.
        if ((data = /\bGoogle TV\b/.exec(product))) {
          product = data[0];
        }
        // Detect simulators.
        if (/\bSimulator\b/i.test(ua)) {
          product = (product ? product + ' ' : '') + 'Simulator';
        }
        // Detect Opera Mini 8+ running in Turbo/Uncompressed mode on iOS.
        if (name == 'Opera Mini' && /\bOPiOS\b/.test(ua)) {
          description.push('running in Turbo/Uncompressed mode');
        }
        // Detect IE Mobile 11.
        if (name == 'IE' && /\blike iPhone OS\b/.test(ua)) {
          data = parse(ua.replace(/like iPhone OS/, ''));
          manufacturer = data.manufacturer;
          product = data.product;
        }
        // Detect iOS.
        else if (/^iP/.test(product)) {
          name || (name = 'Safari');
          os = 'iOS' + ((data = / OS ([\d_]+)/i.exec(ua))
            ? ' ' + data[1].replace(/_/g, '.')
            : '');
        }
        // Detect Kubuntu.
        else if (name == 'Konqueror' && !/buntu/i.test(os)) {
          os = 'Kubuntu';
        }
        // Detect Android browsers.
        else if ((manufacturer && manufacturer != 'Google' &&
            ((/Chrome/.test(name) && !/\bMobile Safari\b/i.test(ua)) || /\bVita\b/.test(product))) ||
            (/\bAndroid\b/.test(os) && /^Chrome/.test(name) && /\bVersion\//i.test(ua))) {
          name = 'Android Browser';
          os = /\bAndroid\b/.test(os) ? os : 'Android';
        }
        // Detect Silk desktop/accelerated modes.
        else if (name == 'Silk') {
          if (!/\bMobi/i.test(ua)) {
            os = 'Android';
            description.unshift('desktop mode');
          }
          if (/Accelerated *= *true/i.test(ua)) {
            description.unshift('accelerated');
          }
        }
        // Detect PaleMoon identifying as Firefox.
        else if (name == 'PaleMoon' && (data = /\bFirefox\/([\d.]+)\b/.exec(ua))) {
          description.push('identifying as Firefox ' + data[1]);
        }
        // Detect Firefox OS and products running Firefox.
        else if (name == 'Firefox' && (data = /\b(Mobile|Tablet|TV)\b/i.exec(ua))) {
          os || (os = 'Firefox OS');
          product || (product = data[1]);
        }
        // Detect false positives for Firefox/Safari.
        else if (!name || (data = !/\bMinefield\b/i.test(ua) && /\b(?:Firefox|Safari)\b/.exec(name))) {
          // Escape the `/` for Firefox 1.
          if (name && !product && /[\/,]|^[^(]+?\)/.test(ua.slice(ua.indexOf(data + '/') + 8))) {
            // Clear name of false positives.
            name = null;
          }
          // Reassign a generic name.
          if ((data = product || manufacturer || os) &&
              (product || manufacturer || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(os))) {
            name = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(os) ? os : data) + ' Browser';
          }
        }
        // Add Chrome version to description for Electron.
        else if (name == 'Electron' && (data = (/\bChrome\/([\d.]+)\b/.exec(ua) || 0)[1])) {
          description.push('Chromium ' + data);
        }
        // Detect non-Opera (Presto-based) versions (order is important).
        if (!version) {
          version = getVersion([
            '(?:Cloud9|CriOS|CrMo|Edge|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$))',
            'Version',
            qualify(name),
            '(?:Firefox|Minefield|NetFront)'
          ]);
        }
        // Detect stubborn layout engines.
        if ((data =
              layout == 'iCab' && parseFloat(version) > 3 && 'WebKit' ||
              /\bOpera\b/.test(name) && (/\bOPR\b/.test(ua) ? 'Blink' : 'Presto') ||
              /\b(?:Midori|Nook|Safari)\b/i.test(ua) && !/^(?:Trident|EdgeHTML)$/.test(layout) && 'WebKit' ||
              !layout && /\bMSIE\b/i.test(ua) && (os == 'Mac OS' ? 'Tasman' : 'Trident') ||
              layout == 'WebKit' && /\bPlayStation\b(?! Vita\b)/i.test(name) && 'NetFront'
            )) {
          layout = [data];
        }
        // Detect Windows Phone 7 desktop mode.
        if (name == 'IE' && (data = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(ua) || 0)[1])) {
          name += ' Mobile';
          os = 'Windows Phone ' + (/\+$/.test(data) ? data : data + '.x');
          description.unshift('desktop mode');
        }
        // Detect Windows Phone 8.x desktop mode.
        else if (/\bWPDesktop\b/i.test(ua)) {
          name = 'IE Mobile';
          os = 'Windows Phone 8.x';
          description.unshift('desktop mode');
          version || (version = (/\brv:([\d.]+)/.exec(ua) || 0)[1]);
        }
        // Detect IE 11 identifying as other browsers.
        else if (name != 'IE' && layout == 'Trident' && (data = /\brv:([\d.]+)/.exec(ua))) {
          if (name) {
            description.push('identifying as ' + name + (version ? ' ' + version : ''));
          }
          name = 'IE';
          version = data[1];
        }
        // Leverage environment features.
        if (useFeatures) {
          // Detect server-side environments.
          // Rhino has a global function while others have a global object.
          if (isHostType(context, 'global')) {
            if (java) {
              data = java.lang.System;
              arch = data.getProperty('os.arch');
              os = os || data.getProperty('os.name') + ' ' + data.getProperty('os.version');
            }
            if (isModuleScope && isHostType(context, 'system') && (data = [context.system])[0]) {
              os || (os = data[0].os || null);
              try {
                data[1] = context.require('ringo/engine').version;
                version = data[1].join('.');
                name = 'RingoJS';
              } catch(e) {
                if (data[0].global.system == context.system) {
                  name = 'Narwhal';
                }
              }
            }
            else if (
              typeof context.process == 'object' && !context.process.browser &&
              (data = context.process)
            ) {
              if (typeof data.versions == 'object') {
                if (typeof data.versions.electron == 'string') {
                  description.push('Node ' + data.versions.node);
                  name = 'Electron';
                  version = data.versions.electron;
                } else if (typeof data.versions.nw == 'string') {
                  description.push('Chromium ' + version, 'Node ' + data.versions.node);
                  name = 'NW.js';
                  version = data.versions.nw;
                }
              } else {
                name = 'Node.js';
                arch = data.arch;
                os = data.platform;
                version = /[\d.]+/.exec(data.version);
                version = version ? version[0] : 'unknown';
              }
            }
            else if (rhino) {
              name = 'Rhino';
            }
          }
          // Detect Adobe AIR.
          else if (getClassOf((data = context.runtime)) == airRuntimeClass) {
            name = 'Adobe AIR';
            os = data.flash.system.Capabilities.os;
          }
          // Detect PhantomJS.
          else if (getClassOf((data = context.phantom)) == phantomClass) {
            name = 'PhantomJS';
            version = (data = data.version || null) && (data.major + '.' + data.minor + '.' + data.patch);
          }
          // Detect IE compatibility modes.
          else if (typeof doc.documentMode == 'number' && (data = /\bTrident\/(\d+)/i.exec(ua))) {
            // We're in compatibility mode when the Trident version + 4 doesn't
            // equal the document mode.
            version = [version, doc.documentMode];
            if ((data = +data[1] + 4) != version[1]) {
              description.push('IE ' + version[1] + ' mode');
              layout && (layout[1] = '');
              version[1] = data;
            }
            version = name == 'IE' ? String(version[1].toFixed(1)) : version[0];
          }
          // Detect IE 11 masking as other browsers.
          else if (typeof doc.documentMode == 'number' && /^(?:Chrome|Firefox)\b/.test(name)) {
            description.push('masking as ' + name + ' ' + version);
            name = 'IE';
            version = '11.0';
            layout = ['Trident'];
            os = 'Windows';
          }
          os = os && format(os);
        }
        // Detect prerelease phases.
        if (version && (data =
              /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(version) ||
              /(?:alpha|beta)(?: ?\d)?/i.exec(ua + ';' + (useFeatures && nav.appMinorVersion)) ||
              /\bMinefield\b/i.test(ua) && 'a'
            )) {
          prerelease = /b/i.test(data) ? 'beta' : 'alpha';
          version = version.replace(RegExp(data + '\\+?$'), '') +
            (prerelease == 'beta' ? beta : alpha) + (/\d+\+?/.exec(data) || '');
        }
        // Detect Firefox Mobile.
        if (name == 'Fennec' || name == 'Firefox' && /\b(?:Android|Firefox OS)\b/.test(os)) {
          name = 'Firefox Mobile';
        }
        // Obscure Maxthon's unreliable version.
        else if (name == 'Maxthon' && version) {
          version = version.replace(/\.[\d.]+/, '.x');
        }
        // Detect Xbox 360 and Xbox One.
        else if (/\bXbox\b/i.test(product)) {
          if (product == 'Xbox 360') {
            os = null;
          }
          if (product == 'Xbox 360' && /\bIEMobile\b/.test(ua)) {
            description.unshift('mobile mode');
          }
        }
        // Add mobile postfix.
        else if ((/^(?:Chrome|IE|Opera)$/.test(name) || name && !product && !/Browser|Mobi/.test(name)) &&
            (os == 'Windows CE' || /Mobi/i.test(ua))) {
          name += ' Mobile';
        }
        // Detect IE platform preview.
        else if (name == 'IE' && useFeatures) {
          try {
            if (context.external === null) {
              description.unshift('platform preview');
            }
          } catch(e) {
            description.unshift('embedded');
          }
        }
        // Detect BlackBerry OS version.
        // http://docs.blackberry.com/en/developers/deliverables/18169/HTTP_headers_sent_by_BB_Browser_1234911_11.jsp
        else if ((/\bBlackBerry\b/.test(product) || /\bBB10\b/.test(ua)) && (data =
              (RegExp(product.replace(/ +/g, ' *') + '/([.\\d]+)', 'i').exec(ua) || 0)[1] ||
              version
            )) {
          data = [data, /BB10/.test(ua)];
          os = (data[1] ? (product = null, manufacturer = 'BlackBerry') : 'Device Software') + ' ' + data[0];
          version = null;
        }
        // Detect Opera identifying/masking itself as another browser.
        // http://www.opera.com/support/kb/view/843/
        else if (this != forOwn && product != 'Wii' && (
              (useFeatures && opera) ||
              (/Opera/.test(name) && /\b(?:MSIE|Firefox)\b/i.test(ua)) ||
              (name == 'Firefox' && /\bOS X (?:\d+\.){2,}/.test(os)) ||
              (name == 'IE' && (
                (os && !/^Win/.test(os) && version > 5.5) ||
                /\bWindows XP\b/.test(os) && version > 8 ||
                version == 8 && !/\bTrident\b/.test(ua)
              ))
            ) && !reOpera.test((data = parse.call(forOwn, ua.replace(reOpera, '') + ';'))) && data.name) {
          // When "identifying", the UA contains both Opera and the other browser's name.
          data = 'ing as ' + data.name + ((data = data.version) ? ' ' + data : '');
          if (reOpera.test(name)) {
            if (/\bIE\b/.test(data) && os == 'Mac OS') {
              os = null;
            }
            data = 'identify' + data;
          }
          // When "masking", the UA contains only the other browser's name.
          else {
            data = 'mask' + data;
            if (operaClass) {
              name = format(operaClass.replace(/([a-z])([A-Z])/g, '$1 $2'));
            } else {
              name = 'Opera';
            }
            if (/\bIE\b/.test(data)) {
              os = null;
            }
            if (!useFeatures) {
              version = null;
            }
          }
          layout = ['Presto'];
          description.push(data);
        }
        // Detect WebKit Nightly and approximate Chrome/Safari versions.
        if ((data = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
          // Correct build number for numeric comparison.
          // (e.g. "532.5" becomes "532.05")
          data = [parseFloat(data.replace(/\.(\d)$/, '.0$1')), data];
          // Nightly builds are postfixed with a "+".
          if (name == 'Safari' && data[1].slice(-1) == '+') {
            name = 'WebKit Nightly';
            prerelease = 'alpha';
            version = data[1].slice(0, -1);
          }
          // Clear incorrect browser versions.
          else if (version == data[1] ||
              version == (data[2] = (/\bSafari\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
            version = null;
          }
          // Use the full Chrome version when available.
          data[1] = (/\bChrome\/([\d.]+)/i.exec(ua) || 0)[1];
          // Detect Blink layout engine.
          if (data[0] == 537.36 && data[2] == 537.36 && parseFloat(data[1]) >= 28 && layout == 'WebKit') {
            layout = ['Blink'];
          }
          // Detect JavaScriptCore.
          // http://stackoverflow.com/questions/6768474/how-can-i-detect-which-javascript-engine-v8-or-jsc-is-used-at-runtime-in-androi
          if (!useFeatures || (!likeChrome && !data[1])) {
            layout && (layout[1] = 'like Safari');
            data = (data = data[0], data < 400 ? 1 : data < 500 ? 2 : data < 526 ? 3 : data < 533 ? 4 : data < 534 ? '4+' : data < 535 ? 5 : data < 537 ? 6 : data < 538 ? 7 : data < 601 ? 8 : '8');
          } else {
            layout && (layout[1] = 'like Chrome');
            data = data[1] || (data = data[0], data < 530 ? 1 : data < 532 ? 2 : data < 532.05 ? 3 : data < 533 ? 4 : data < 534.03 ? 5 : data < 534.07 ? 6 : data < 534.10 ? 7 : data < 534.13 ? 8 : data < 534.16 ? 9 : data < 534.24 ? 10 : data < 534.30 ? 11 : data < 535.01 ? 12 : data < 535.02 ? '13+' : data < 535.07 ? 15 : data < 535.11 ? 16 : data < 535.19 ? 17 : data < 536.05 ? 18 : data < 536.10 ? 19 : data < 537.01 ? 20 : data < 537.11 ? '21+' : data < 537.13 ? 23 : data < 537.18 ? 24 : data < 537.24 ? 25 : data < 537.36 ? 26 : layout != 'Blink' ? '27' : '28');
          }
          // Add the postfix of ".x" or "+" for approximate versions.
          layout && (layout[1] += ' ' + (data += typeof data == 'number' ? '.x' : /[.+]/.test(data) ? '' : '+'));
          // Obscure version for some Safari 1-2 releases.
          if (name == 'Safari' && (!version || parseInt(version) > 45)) {
            version = data;
          }
        }
        // Detect Opera desktop modes.
        if (name == 'Opera' &&  (data = /\bzbov|zvav$/.exec(os))) {
          name += ' ';
          description.unshift('desktop mode');
          if (data == 'zvav') {
            name += 'Mini';
            version = null;
          } else {
            name += 'Mobile';
          }
          os = os.replace(RegExp(' *' + data + '$'), '');
        }
        // Detect Chrome desktop mode.
        else if (name == 'Safari' && /\bChrome\b/.exec(layout && layout[1])) {
          description.unshift('desktop mode');
          name = 'Chrome Mobile';
          version = null;

          if (/\bOS X\b/.test(os)) {
            manufacturer = 'Apple';
            os = 'iOS 4.3+';
          } else {
            os = null;
          }
        }
        // Strip incorrect OS versions.
        if (version && version.indexOf((data = /[\d.]+$/.exec(os))) == 0 &&
            ua.indexOf('/' + data + '-') > -1) {
          os = trim(os.replace(data, ''));
        }
        // Add layout engine.
        if (layout && !/\b(?:Avant|Nook)\b/.test(name) && (
            /Browser|Lunascape|Maxthon/.test(name) ||
            name != 'Safari' && /^iOS/.test(os) && /\bSafari\b/.test(layout[1]) ||
            /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|Web)/.test(name) && layout[1])) {
          // Don't add layout details to description if they are falsey.
          (data = layout[layout.length - 1]) && description.push(data);
        }
        // Combine contextual information.
        if (description.length) {
          description = ['(' + description.join('; ') + ')'];
        }
        // Append manufacturer to description.
        if (manufacturer && product && product.indexOf(manufacturer) < 0) {
          description.push('on ' + manufacturer);
        }
        // Append product to description.
        if (product) {
          description.push((/^on /.test(description[description.length - 1]) ? '' : 'on ') + product);
        }
        // Parse the OS into an object.
        if (os) {
          data = / ([\d.+]+)$/.exec(os);
          isSpecialCasedOS = data && os.charAt(os.length - data[0].length - 1) == '/';
          os = {
            'architecture': 32,
            'family': (data && !isSpecialCasedOS) ? os.replace(data[0], '') : os,
            'version': data ? data[1] : null,
            'toString': function() {
              var version = this.version;
              return this.family + ((version && !isSpecialCasedOS) ? ' ' + version : '') + (this.architecture == 64 ? ' 64-bit' : '');
            }
          };
        }
        // Add browser/OS architecture.
        if ((data = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(arch)) && !/\bi686\b/i.test(arch)) {
          if (os) {
            os.architecture = 64;
            os.family = os.family.replace(RegExp(' *' + data), '');
          }
          if (
              name && (/\bWOW64\b/i.test(ua) ||
              (useFeatures && /\w(?:86|32)$/.test(nav.cpuClass || nav.platform) && !/\bWin64; x64\b/i.test(ua)))
          ) {
            description.unshift('32-bit');
          }
        }
        // Chrome 39 and above on OS X is always 64-bit.
        else if (
            os && /^OS X/.test(os.family) &&
            name == 'Chrome' && parseFloat(version) >= 39
        ) {
          os.architecture = 64;
        }

        ua || (ua = null);

        /*------------------------------------------------------------------------*/

        /**
         * The platform object.
         *
         * @name platform
         * @type Object
         */
        var platform = {};

        /**
         * The platform description.
         *
         * @memberOf platform
         * @type string|null
         */
        platform.description = ua;

        /**
         * The name of the browser's layout engine.
         *
         * The list of common layout engines include:
         * "Blink", "EdgeHTML", "Gecko", "Trident" and "WebKit"
         *
         * @memberOf platform
         * @type string|null
         */
        platform.layout = layout && layout[0];

        /**
         * The name of the product's manufacturer.
         *
         * The list of manufacturers include:
         * "Apple", "Archos", "Amazon", "Asus", "Barnes & Noble", "BlackBerry",
         * "Google", "HP", "HTC", "LG", "Microsoft", "Motorola", "Nintendo",
         * "Nokia", "Samsung" and "Sony"
         *
         * @memberOf platform
         * @type string|null
         */
        platform.manufacturer = manufacturer;

        /**
         * The name of the browser/environment.
         *
         * The list of common browser names include:
         * "Chrome", "Electron", "Firefox", "Firefox for iOS", "IE",
         * "Microsoft Edge", "PhantomJS", "Safari", "SeaMonkey", "Silk",
         * "Opera Mini" and "Opera"
         *
         * Mobile versions of some browsers have "Mobile" appended to their name:
         * eg. "Chrome Mobile", "Firefox Mobile", "IE Mobile" and "Opera Mobile"
         *
         * @memberOf platform
         * @type string|null
         */
        platform.name = name;

        /**
         * The alpha/beta release indicator.
         *
         * @memberOf platform
         * @type string|null
         */
        platform.prerelease = prerelease;

        /**
         * The name of the product hosting the browser.
         *
         * The list of common products include:
         *
         * "BlackBerry", "Galaxy S4", "Lumia", "iPad", "iPod", "iPhone", "Kindle",
         * "Kindle Fire", "Nexus", "Nook", "PlayBook", "TouchPad" and "Transformer"
         *
         * @memberOf platform
         * @type string|null
         */
        platform.product = product;

        /**
         * The browser's user agent string.
         *
         * @memberOf platform
         * @type string|null
         */
        platform.ua = ua;

        /**
         * The browser/environment version.
         *
         * @memberOf platform
         * @type string|null
         */
        platform.version = name && version;

        /**
         * The name of the operating system.
         *
         * @memberOf platform
         * @type Object
         */
        platform.os = os || {

          /**
           * The CPU architecture the OS is built for.
           *
           * @memberOf platform.os
           * @type number|null
           */
          'architecture': null,

          /**
           * The family of the OS.
           *
           * Common values include:
           * "Windows", "Windows Server 2008 R2 / 7", "Windows Server 2008 / Vista",
           * "Windows XP", "OS X", "Ubuntu", "Debian", "Fedora", "Red Hat", "SuSE",
           * "Android", "iOS" and "Windows Phone"
           *
           * @memberOf platform.os
           * @type string|null
           */
          'family': null,

          /**
           * The version of the OS.
           *
           * @memberOf platform.os
           * @type string|null
           */
          'version': null,

          /**
           * Returns the OS string.
           *
           * @memberOf platform.os
           * @returns {string} The OS string.
           */
          'toString': function() { return 'null'; }
        };

        platform.parse = parse;
        platform.toString = toStringPlatform;

        if (platform.version) {
          description.unshift(version);
        }
        if (platform.name) {
          description.unshift(name);
        }
        if (os && name && !(os == String(os).split(' ')[0] && (os == name.split(' ')[0] || product))) {
          description.push(product ? '(' + os + ')' : 'on ' + os);
        }
        if (description.length) {
          platform.description = description.join(' ');
        }
        return platform;
      }

      /*--------------------------------------------------------------------------*/

      // Export platform.
      var platform = parse();

      // Some AMD build optimizers, like r.js, check for condition patterns like the following:
      if (freeExports && freeModule) {
        // Export for CommonJS support.
        forOwn(platform, function(value, key) {
          freeExports[key] = value;
        });
      }
      else {
        // Export to the global object.
        root.platform = platform;
      }
    }.call(commonjsGlobal));
    });

    var es6Promise = createCommonjsModule(function (module, exports) {
    /*!
     * @overview es6-promise - a tiny implementation of Promises/A+.
     * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
     * @license   Licensed under MIT license
     *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
     * @version   v4.2.6+9869a4bc
     */

    (function (global, factory) {
    	module.exports = factory();
    }(commonjsGlobal, (function () {
    function objectOrFunction(x) {
      var type = typeof x;
      return x !== null && (type === 'object' || type === 'function');
    }

    function isFunction(x) {
      return typeof x === 'function';
    }



    var _isArray = void 0;
    if (Array.isArray) {
      _isArray = Array.isArray;
    } else {
      _isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    }

    var isArray = _isArray;

    var len = 0;
    var vertxNext = void 0;
    var customSchedulerFn = void 0;

    var asap = function asap(callback, arg) {
      queue[len] = callback;
      queue[len + 1] = arg;
      len += 2;
      if (len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        if (customSchedulerFn) {
          customSchedulerFn(flush);
        } else {
          scheduleFlush();
        }
      }
    };

    function setScheduler(scheduleFn) {
      customSchedulerFn = scheduleFn;
    }

    function setAsap(asapFn) {
      asap = asapFn;
    }

    var browserWindow = typeof window !== 'undefined' ? window : undefined;
    var browserGlobal = browserWindow || {};
    var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
    var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

    // node
    function useNextTick() {
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // see https://github.com/cujojs/when/issues/410 for details
      return function () {
        return process.nextTick(flush);
      };
    }

    // vertx
    function useVertxTimer() {
      if (typeof vertxNext !== 'undefined') {
        return function () {
          vertxNext(flush);
        };
      }

      return useSetTimeout();
    }

    function useMutationObserver() {
      var iterations = 0;
      var observer = new BrowserMutationObserver(flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function () {
        node.data = iterations = ++iterations % 2;
      };
    }

    // web worker
    function useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = flush;
      return function () {
        return channel.port2.postMessage(0);
      };
    }

    function useSetTimeout() {
      // Store setTimeout reference so es6-promise will be unaffected by
      // other code modifying setTimeout (like sinon.useFakeTimers())
      var globalSetTimeout = setTimeout;
      return function () {
        return globalSetTimeout(flush, 1);
      };
    }

    var queue = new Array(1000);
    function flush() {
      for (var i = 0; i < len; i += 2) {
        var callback = queue[i];
        var arg = queue[i + 1];

        callback(arg);

        queue[i] = undefined;
        queue[i + 1] = undefined;
      }

      len = 0;
    }

    function attemptVertx() {
      try {
        var vertx = Function('return this')().require('vertx');
        vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return useVertxTimer();
      } catch (e) {
        return useSetTimeout();
      }
    }

    var scheduleFlush = void 0;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (isNode) {
      scheduleFlush = useNextTick();
    } else if (BrowserMutationObserver) {
      scheduleFlush = useMutationObserver();
    } else if (isWorker) {
      scheduleFlush = useMessageChannel();
    } else if (browserWindow === undefined && typeof commonjsRequire === 'function') {
      scheduleFlush = attemptVertx();
    } else {
      scheduleFlush = useSetTimeout();
    }

    function then(onFulfillment, onRejection) {
      var parent = this;

      var child = new this.constructor(noop);

      if (child[PROMISE_ID] === undefined) {
        makePromise(child);
      }

      var _state = parent._state;


      if (_state) {
        var callback = arguments[_state - 1];
        asap(function () {
          return invokeCallback(_state, child, callback, parent._result);
        });
      } else {
        subscribe(parent, child, onFulfillment, onRejection);
      }

      return child;
    }

    /**
      `Promise.resolve` returns a promise that will become resolved with the
      passed `value`. It is shorthand for the following:

      ```javascript
      let promise = new Promise(function(resolve, reject){
        resolve(1);
      });

      promise.then(function(value){
        // value === 1
      });
      ```

      Instead of writing the above, your code now simply becomes the following:

      ```javascript
      let promise = Promise.resolve(1);

      promise.then(function(value){
        // value === 1
      });
      ```

      @method resolve
      @static
      @param {Any} value value that the returned promise will be resolved with
      Useful for tooling.
      @return {Promise} a promise that will become fulfilled with the given
      `value`
    */
    function resolve$1(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(noop);
      resolve(promise, object);
      return promise;
    }

    var PROMISE_ID = Math.random().toString(36).substring(2);

    function noop() {}

    var PENDING = void 0;
    var FULFILLED = 1;
    var REJECTED = 2;

    var TRY_CATCH_ERROR = { error: null };

    function selfFulfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function getThen(promise) {
      try {
        return promise.then;
      } catch (error) {
        TRY_CATCH_ERROR.error = error;
        return TRY_CATCH_ERROR;
      }
    }

    function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
      try {
        then$$1.call(value, fulfillmentHandler, rejectionHandler);
      } catch (e) {
        return e;
      }
    }

    function handleForeignThenable(promise, thenable, then$$1) {
      asap(function (promise) {
        var sealed = false;
        var error = tryThen(then$$1, thenable, function (value) {
          if (sealed) {
            return;
          }
          sealed = true;
          if (thenable !== value) {
            resolve(promise, value);
          } else {
            fulfill(promise, value);
          }
        }, function (reason) {
          if (sealed) {
            return;
          }
          sealed = true;

          reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          reject(promise, error);
        }
      }, promise);
    }

    function handleOwnThenable(promise, thenable) {
      if (thenable._state === FULFILLED) {
        fulfill(promise, thenable._result);
      } else if (thenable._state === REJECTED) {
        reject(promise, thenable._result);
      } else {
        subscribe(thenable, undefined, function (value) {
          return resolve(promise, value);
        }, function (reason) {
          return reject(promise, reason);
        });
      }
    }

    function handleMaybeThenable(promise, maybeThenable, then$$1) {
      if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
        handleOwnThenable(promise, maybeThenable);
      } else {
        if (then$$1 === TRY_CATCH_ERROR) {
          reject(promise, TRY_CATCH_ERROR.error);
          TRY_CATCH_ERROR.error = null;
        } else if (then$$1 === undefined) {
          fulfill(promise, maybeThenable);
        } else if (isFunction(then$$1)) {
          handleForeignThenable(promise, maybeThenable, then$$1);
        } else {
          fulfill(promise, maybeThenable);
        }
      }
    }

    function resolve(promise, value) {
      if (promise === value) {
        reject(promise, selfFulfillment());
      } else if (objectOrFunction(value)) {
        handleMaybeThenable(promise, value, getThen(value));
      } else {
        fulfill(promise, value);
      }
    }

    function publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      publish(promise);
    }

    function fulfill(promise, value) {
      if (promise._state !== PENDING) {
        return;
      }

      promise._result = value;
      promise._state = FULFILLED;

      if (promise._subscribers.length !== 0) {
        asap(publish, promise);
      }
    }

    function reject(promise, reason) {
      if (promise._state !== PENDING) {
        return;
      }
      promise._state = REJECTED;
      promise._result = reason;

      asap(publishRejection, promise);
    }

    function subscribe(parent, child, onFulfillment, onRejection) {
      var _subscribers = parent._subscribers;
      var length = _subscribers.length;


      parent._onerror = null;

      _subscribers[length] = child;
      _subscribers[length + FULFILLED] = onFulfillment;
      _subscribers[length + REJECTED] = onRejection;

      if (length === 0 && parent._state) {
        asap(publish, parent);
      }
    }

    function publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) {
        return;
      }

      var child = void 0,
          callback = void 0,
          detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch (e) {
        TRY_CATCH_ERROR.error = e;
        return TRY_CATCH_ERROR;
      }
    }

    function invokeCallback(settled, promise, callback, detail) {
      var hasCallback = isFunction(callback),
          value = void 0,
          error = void 0,
          succeeded = void 0,
          failed = void 0;

      if (hasCallback) {
        value = tryCatch(callback, detail);

        if (value === TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value.error = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          reject(promise, cannotReturnOwn());
          return;
        }
      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== PENDING) ; else if (hasCallback && succeeded) {
        resolve(promise, value);
      } else if (failed) {
        reject(promise, error);
      } else if (settled === FULFILLED) {
        fulfill(promise, value);
      } else if (settled === REJECTED) {
        reject(promise, value);
      }
    }

    function initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value) {
          resolve(promise, value);
        }, function rejectPromise(reason) {
          reject(promise, reason);
        });
      } catch (e) {
        reject(promise, e);
      }
    }

    var id = 0;
    function nextId() {
      return id++;
    }

    function makePromise(promise) {
      promise[PROMISE_ID] = id++;
      promise._state = undefined;
      promise._result = undefined;
      promise._subscribers = [];
    }

    function validationError() {
      return new Error('Array Methods must be provided an Array');
    }

    var Enumerator = function () {
      function Enumerator(Constructor, input) {
        this._instanceConstructor = Constructor;
        this.promise = new Constructor(noop);

        if (!this.promise[PROMISE_ID]) {
          makePromise(this.promise);
        }

        if (isArray(input)) {
          this.length = input.length;
          this._remaining = input.length;

          this._result = new Array(this.length);

          if (this.length === 0) {
            fulfill(this.promise, this._result);
          } else {
            this.length = this.length || 0;
            this._enumerate(input);
            if (this._remaining === 0) {
              fulfill(this.promise, this._result);
            }
          }
        } else {
          reject(this.promise, validationError());
        }
      }

      Enumerator.prototype._enumerate = function _enumerate(input) {
        for (var i = 0; this._state === PENDING && i < input.length; i++) {
          this._eachEntry(input[i], i);
        }
      };

      Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
        var c = this._instanceConstructor;
        var resolve$$1 = c.resolve;


        if (resolve$$1 === resolve$1) {
          var _then = getThen(entry);

          if (_then === then && entry._state !== PENDING) {
            this._settledAt(entry._state, i, entry._result);
          } else if (typeof _then !== 'function') {
            this._remaining--;
            this._result[i] = entry;
          } else if (c === Promise$1) {
            var promise = new c(noop);
            handleMaybeThenable(promise, entry, _then);
            this._willSettleAt(promise, i);
          } else {
            this._willSettleAt(new c(function (resolve$$1) {
              return resolve$$1(entry);
            }), i);
          }
        } else {
          this._willSettleAt(resolve$$1(entry), i);
        }
      };

      Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
        var promise = this.promise;


        if (promise._state === PENDING) {
          this._remaining--;

          if (state === REJECTED) {
            reject(promise, value);
          } else {
            this._result[i] = value;
          }
        }

        if (this._remaining === 0) {
          fulfill(promise, this._result);
        }
      };

      Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
        var enumerator = this;

        subscribe(promise, undefined, function (value) {
          return enumerator._settledAt(FULFILLED, i, value);
        }, function (reason) {
          return enumerator._settledAt(REJECTED, i, reason);
        });
      };

      return Enumerator;
    }();

    /**
      `Promise.all` accepts an array of promises, and returns a new promise which
      is fulfilled with an array of fulfillment values for the passed promises, or
      rejected with the reason of the first passed promise to be rejected. It casts all
      elements of the passed iterable to promises as it runs this algorithm.

      Example:

      ```javascript
      let promise1 = resolve(1);
      let promise2 = resolve(2);
      let promise3 = resolve(3);
      let promises = [ promise1, promise2, promise3 ];

      Promise.all(promises).then(function(array){
        // The array here would be [ 1, 2, 3 ];
      });
      ```

      If any of the `promises` given to `all` are rejected, the first promise
      that is rejected will be given as an argument to the returned promises's
      rejection handler. For example:

      Example:

      ```javascript
      let promise1 = resolve(1);
      let promise2 = reject(new Error("2"));
      let promise3 = reject(new Error("3"));
      let promises = [ promise1, promise2, promise3 ];

      Promise.all(promises).then(function(array){
        // Code here never runs because there are rejected promises!
      }, function(error) {
        // error.message === "2"
      });
      ```

      @method all
      @static
      @param {Array} entries array of promises
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise} promise that is fulfilled when all `promises` have been
      fulfilled, or rejected if any of them become rejected.
      @static
    */
    function all(entries) {
      return new Enumerator(this, entries).promise;
    }

    /**
      `Promise.race` returns a new promise which is settled in the same way as the
      first passed promise to settle.

      Example:

      ```javascript
      let promise1 = new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve('promise 1');
        }, 200);
      });

      let promise2 = new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve('promise 2');
        }, 100);
      });

      Promise.race([promise1, promise2]).then(function(result){
        // result === 'promise 2' because it was resolved before promise1
        // was resolved.
      });
      ```

      `Promise.race` is deterministic in that only the state of the first
      settled promise matters. For example, even if other promises given to the
      `promises` array argument are resolved, but the first settled promise has
      become rejected before the other promises became fulfilled, the returned
      promise will become rejected:

      ```javascript
      let promise1 = new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve('promise 1');
        }, 200);
      });

      let promise2 = new Promise(function(resolve, reject){
        setTimeout(function(){
          reject(new Error('promise 2'));
        }, 100);
      });

      Promise.race([promise1, promise2]).then(function(result){
        // Code here never runs
      }, function(reason){
        // reason.message === 'promise 2' because promise 2 became rejected before
        // promise 1 became fulfilled
      });
      ```

      An example real-world use case is implementing timeouts:

      ```javascript
      Promise.race([ajax('foo.json'), timeout(5000)])
      ```

      @method race
      @static
      @param {Array} promises array of promises to observe
      Useful for tooling.
      @return {Promise} a promise which settles in the same way as the first passed
      promise to settle.
    */
    function race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      if (!isArray(entries)) {
        return new Constructor(function (_, reject) {
          return reject(new TypeError('You must pass an array to race.'));
        });
      } else {
        return new Constructor(function (resolve, reject) {
          var length = entries.length;
          for (var i = 0; i < length; i++) {
            Constructor.resolve(entries[i]).then(resolve, reject);
          }
        });
      }
    }

    /**
      `Promise.reject` returns a promise rejected with the passed `reason`.
      It is shorthand for the following:

      ```javascript
      let promise = new Promise(function(resolve, reject){
        reject(new Error('WHOOPS'));
      });

      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```

      Instead of writing the above, your code now simply becomes the following:

      ```javascript
      let promise = Promise.reject(new Error('WHOOPS'));

      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```

      @method reject
      @static
      @param {Any} reason value that the returned promise will be rejected with.
      Useful for tooling.
      @return {Promise} a promise rejected with the given `reason`.
    */
    function reject$1(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(noop);
      reject(promise, reason);
      return promise;
    }

    function needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise's eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      let promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          let xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {Function} resolver
      Useful for tooling.
      @constructor
    */

    var Promise$1 = function () {
      function Promise(resolver) {
        this[PROMISE_ID] = nextId();
        this._result = this._state = undefined;
        this._subscribers = [];

        if (noop !== resolver) {
          typeof resolver !== 'function' && needsResolver();
          this instanceof Promise ? initializePromise(this, resolver) : needsNew();
        }
      }

      /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.
       ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```
       Chaining
      --------
       The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.
       ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });
       findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
       ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```
       Assimilation
      ------------
       Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.
       ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```
       If the assimliated promise rejects, then the downstream promise will also reject.
       ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```
       Simple Example
      --------------
       Synchronous Example
       ```javascript
      let result;
       try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```
       Errback Example
       ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```
       Promise Example;
       ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```
       Advanced Example
      --------------
       Synchronous Example
       ```javascript
      let author, books;
       try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```
       Errback Example
       ```js
       function foundBooks(books) {
       }
       function failure(reason) {
       }
       findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```
       Promise Example;
       ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```
       @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
      */

      /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.
      ```js
      function findAuthor(){
      throw new Error('couldn't find that author');
      }
      // synchronous
      try {
      findAuthor();
      } catch(reason) {
      // something went wrong
      }
      // async with promises
      findAuthor().catch(function(reason){
      // something went wrong
      });
      ```
      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
      */


      Promise.prototype.catch = function _catch(onRejection) {
        return this.then(null, onRejection);
      };

      /**
        `finally` will be invoked regardless of the promise's fate just as native
        try/catch/finally behaves
      
        Synchronous example:
      
        ```js
        findAuthor() {
          if (Math.random() > 0.5) {
            throw new Error();
          }
          return new Author();
        }
      
        try {
          return findAuthor(); // succeed or fail
        } catch(error) {
          return findOtherAuther();
        } finally {
          // always runs
          // doesn't affect the return value
        }
        ```
      
        Asynchronous example:
      
        ```js
        findAuthor().catch(function(reason){
          return findOtherAuther();
        }).finally(function(){
          // author was either found, or not
        });
        ```
      
        @method finally
        @param {Function} callback
        @return {Promise}
      */


      Promise.prototype.finally = function _finally(callback) {
        var promise = this;
        var constructor = promise.constructor;

        if (isFunction(callback)) {
          return promise.then(function (value) {
            return constructor.resolve(callback()).then(function () {
              return value;
            });
          }, function (reason) {
            return constructor.resolve(callback()).then(function () {
              throw reason;
            });
          });
        }

        return promise.then(callback, callback);
      };

      return Promise;
    }();

    Promise$1.prototype.then = then;
    Promise$1.all = all;
    Promise$1.race = race;
    Promise$1.resolve = resolve$1;
    Promise$1.reject = reject$1;
    Promise$1._setScheduler = setScheduler;
    Promise$1._setAsap = setAsap;
    Promise$1._asap = asap;

    /*global self*/
    function polyfill() {
      var local = void 0;

      if (typeof commonjsGlobal !== 'undefined') {
        local = commonjsGlobal;
      } else if (typeof self !== 'undefined') {
        local = self;
      } else {
        try {
          local = Function('return this')();
        } catch (e) {
          throw new Error('polyfill failed because global object is unavailable in this environment');
        }
      }

      var P = local.Promise;

      if (P) {
        var promiseToString = null;
        try {
          promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
          // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
          return;
        }
      }

      local.Promise = Promise$1;
    }

    // Strange compat..
    Promise$1.polyfill = polyfill;
    Promise$1.Promise = Promise$1;

    return Promise$1;

    })));




    });

    var testRunnerUrl = location.href;
    var hasHistoryApi = typeof window.history !== 'undefined' && typeof window.history.replaceState !== 'undefined';
    var uploadResults = function (canvas, url) {
        return new es6Promise(function (resolve, reject) {
            // @ts-ignore
            var xhr = 'withCredentials' in new XMLHttpRequest() ? new XMLHttpRequest() : new XDomainRequest();
            xhr.onload = function () {
                if (typeof xhr.status !== 'number' || xhr.status === 200) {
                    resolve();
                }
                else {
                    reject("Failed to send screenshot with status " + xhr.status);
                }
            };
            xhr.onerror = reject;
            xhr.open('POST', 'http://localhost:8000/screenshot', true);
            xhr.send(JSON.stringify({
                screenshot: canvas.toDataURL(),
                test: url,
                platform: {
                    name: platform.name,
                    version: platform.version
                },
                devicePixelRatio: window.devicePixelRatio || 1,
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight
            }));
        });
    };
    testList
        .filter(function (test) {
        return !Array.isArray(ignoredTests[test]) || ignoredTests[test].indexOf(platform.name || '') === -1;
    })
        .forEach(function (url) {
        describe(url, function () {
            this.timeout(60000);
            this.retries(2);
            var windowWidth = 800;
            var windowHeight = 600;
            var testContainer = document.createElement('iframe');
            testContainer.width = windowWidth.toString();
            testContainer.height = windowHeight.toString();
            testContainer.style.visibility = 'hidden';
            testContainer.style.position = 'fixed';
            testContainer.style.left = '10000px';
            before(function (done) {
                testContainer.onload = function () { return done(); };
                testContainer.src = url + '?selenium&run=false&reftest&' + Math.random();
                if (hasHistoryApi) {
                    // Chrome does not resolve relative background urls correctly inside of a nested iframe
                    try {
                        history.replaceState(null, '', url);
                    }
                    catch (e) { }
                }
                document.body.appendChild(testContainer);
            });
            after(function () {
                if (hasHistoryApi) {
                    try {
                        history.replaceState(null, '', testRunnerUrl);
                    }
                    catch (e) { }
                }
                document.body.removeChild(testContainer);
            });
            it('Should render untainted canvas', function () {
                var contentWindow = testContainer.contentWindow;
                if (!contentWindow) {
                    throw new Error('Window not found for iframe');
                }
                return (contentWindow
                    // @ts-ignore
                    .html2canvas(contentWindow.forceElement || contentWindow.document.documentElement, __assign({ removeContainer: true, backgroundColor: '#ffffff', proxy: 'http://localhost:8081/proxy' }, (contentWindow.h2cOptions || {})))
                    .then(function (canvas) {
                    try {
                        canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
                    }
                    catch (e) {
                        return es6Promise.reject('Canvas is tainted');
                    }
                    // @ts-ignore
                    if (window.__karma__) {
                        return uploadResults(canvas, url);
                    }
                }));
            });
        });
    });

}());
//# sourceMappingURL=testrunner.js.map
