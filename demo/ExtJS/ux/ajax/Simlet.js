/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
 * @author Don Griffin
 * @class Ext.ux.ajax.Simlet
 *
 * This is a base class for more advanced "simlets" (simulated servers). A simlet is asked
 * to provide a response given a {@link SimXhr} instance.
 */
Ext.define('Ext.ux.ajax.Simlet', function () {
    var urlRegex = /([^?#]*)(#.*)?$/,
        dateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/,
        intRegex = /^[+-]?\d+$/,
        floatRegex = /^[+-]?\d+\.\d+$/;

    function parseParamValue (value) {
        var m;

        if (Ext.isDefined(value)) {
            value = decodeURIComponent(value);

            if (intRegex.test(value)) {
                value = parseInt(value, 10);
            } else if (floatRegex.test(value)) {
                value = parseFloat(value);
            } else if (!!(m = dateRegex.test(value))) {
                value = new Date(Date.UTC(+m[1], +m[2]-1, +m[3], +m[4], +m[5], +m[6]));
            }
        }

        return value;
    }

    return {
        alias: 'simlet.basic',

        isSimlet: true,

        responseProps: ['responseText', 'responseXML', 'status', 'statusText'],

        /**
         * @cfg {Number} responseText
         */

        /**
         * @cfg {Number} responseXML
         */

        /**
         * @cfg {Object} responseHeaders
         */

        /**
         * @cfg {Number} status
         */
        status: 200,

        /**
         * @cfg {String} statusText
         */
        statusText: 'OK',

        constructor: function (config) {
            Ext.apply(this, config);
        },

        doGet: function (ctx) {
            var me = this,
                ret = {};

            Ext.each(me.responseProps, function (prop) {
                if (prop in me) {
                    ret[prop] = me[prop];
                }
            });

            return ret;
        },

        /**
         * Performs the action requested by the given XHR and returns an object to be applied
         * on to the XHR (containing `status`, `responseText`, etc.). For the most part,
         * this is delegated to `doMethod` methods on this class, such as `doGet`.
         *
         * @param {SimXhr} xhr The simulated XMLHttpRequest instance.
         * @returns {Object} The response properties to add to the XMLHttpRequest.
         * @markdown
         */
        exec: function (xhr) {
            var me = this,
                ret = {},
                method = 'do' + Ext.String.capitalize(xhr.method.toLowerCase()), // doGet
                fn = me[method];

            if (fn) {
                ret = fn.call(me, {
                        xhr: xhr,
                        params: me.parseQueryString(xhr.url)
                    });
            } else {
                ret = { status: 405, statusText: 'Method Not Allowed' };
            }

            return ret;
        },

        parseQueryString : function (str) {
            var m = urlRegex.exec(str),
                ret = {},
                key,
                value,
                i, n;

            if (m && m[1]) {
                var pair, parts = m[1].split('&');

                for (i = 0, n = parts.length; i < n; ++i) {
                    if ((pair = parts[i].split('='))[0]) {
                        key = decodeURIComponent(pair.shift());
                        value = parseParamValue((pair.length > 1) ? pair.join('=') : pair[0]);

                        if (!(key in ret)) {
                            ret[key] = value;
                        } else if (Ext.isArray(ret[key])) {
                            ret[key].push(value);
                        } else {
                            ret[key] = [ret[key], value];
                        }
                    }
                }
            }

            return ret;
        }
    };
}());

