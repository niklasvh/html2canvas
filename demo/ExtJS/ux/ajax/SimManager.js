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
 * @class Ext.ux.ajax.SimManager
 *
 * This singleton manages simulated Ajax responses. This allows application logic to be
 * written unaware that its Ajax calls are being handled by simulations ("simlets"). This
 * is currently done by hooking {@link Ext.data.Connection} methods, so all users of that
 * class (and {@link Ext.Ajax} since it is a derived class) qualify for simulation.
 *
 * The requires hooks are inserted when either the {@link #init} method is called or the
 * first {@link Simlet} is registered. For example:
 *
 *      Ext.onReady(function () {
 *          initAjaxSim();
 *
 *          // normal stuff
 *      });
 *
 *      function initAjaxSim () {
 *          Ext.ux.ajax.SimManager.init({
 *              delay: 300
 *          }).register({
 *              '/app/data/url': {
 *                  stype: 'json',  // use JsonSimlet (stype is like xtype for components)
 *                  data: [
 *                      { foo: 42, bar: 'abc' },
 *                      ...
 *                  ]
 *              }
 *          });
 *      }
 *
 * As many URL's as desired can be registered and associated with a {@link Simlet}. To make
 * non-simulated Ajax requests once this singleton is initialized, add a `nosim:true` option
 * to the Ajax options:
 *
 *      Ext.Ajax.request({
 *          url: 'page.php',
 *          nosim: true, // ignored by normal Ajax request
 *          params: {
 *              id: 1
 *          },
 *          success: function(response){
 *              var text = response.responseText;
 *              // process server response here
 *          }
 *      });
 *
 * @markdown
 */
Ext.define('Ext.ux.ajax.SimManager', {
    singleton: true,

    requires: [
        'Ext.data.Connection',
        'Ext.ux.ajax.SimXhr',
        'Ext.ux.ajax.Simlet',
        'Ext.ux.ajax.JsonSimlet'
    ],

    /**
     * @cfg {Ext.ux.ajax.Simlet} defaultSimlet
     * The {@link Simlet} instance to use for non-matching URL's. By default, this will
     * return 404. Set this to null to use real Ajax calls for non-matching URL's.
     */

    /**
     * @cfg {String} defaultType
     * The default `stype` to apply to generic {@link Simlet} configuration objects. The
     * default is 'basic'.
     */
    defaultType: 'basic',

    /**
     * @cfg {Number} delay
     * The number of milliseconds to delay before delivering a response to an async request.
     */
    delay: 150,

    /**
     * @prop {Boolean} ready
     * True once this singleton has initialized and applied its Ajax hooks.
     * @private
     */
    ready: false,

    constructor: function () {
        this.simlets = {};
    },

    getXhr: function (url) {
        // Strip down to base URL (no query parameters or hash):
        var me = this,
            index = url.indexOf('?');

        if (index < 0) {
            index = url.indexOf('#');
        }
        if (index > 0) {
            url = url.substring(0, index);
        }

        var simlet = me.simlets[url] || me.defaultSimlet;

        if (simlet) {
            return Ext.create('Ext.ux.ajax.SimXhr', { mgr: me, simlet: simlet });
        }
        return null;
    },

    /**
     * Initializes this singleton and applies configuration options.
     * @param {Object} config An optional object with configuration properties to apply.
     * @return {SimManager} this
     * @markdown
     */
    init: function (config) {
        var me = this,
            proto = Ext.data.Connection.prototype,
            newXhr = proto.getXhrInstance,
            setOptions = proto.setOptions,
            url;

        Ext.apply(me, config);

        if (!me.ready) {
            me.ready = true;

            if (!('defaultSimlet' in me)) {
                me.defaultSimlet = Ext.create('Ext.ux.ajax.Simlet', {
                    status: 404,
                    statusText: 'Not Found'
                });
            }

            proto.getXhrInstance = function () {
                // the only way 'url' will be null is for nosim...
                var xhr = url && me.getXhr(url);
                if (!xhr) {
                    xhr = newXhr.call(this);
                }
                return xhr;
            };

            proto.setOptions = function (options) {
                var ret = setOptions.apply(this, arguments);
                // remember the URL so we can give the right Simlet to the SimXhr...
                url = options.nosim ? null : ret.url;
                return ret;
            };
        }

        return me;
    },

    /**
     * Registeres one or more {@link Simlet} instances.
     * @param {Array/Object} simlet Either a {@link Simlet} instance or config, an Array
     * of such elements or an Object keyed by URL with values that are {@link Simlet}
     * instances or configs.
     * @markdown
     */
    register: function (simlet) {
        var me = this,
            i, n;

        me.init();

        function reg (one) {
            var simlet = one;
            if (!simlet.isSimlet) {
                simlet = Ext.create('simlet.' + (simlet.stype || me.defaultType), one);
            }
            me.simlets[one.url] = simlet;
        }

        if (Ext.isArray(simlet)) {
            Ext.each(simlet, reg);
        } else if (simlet.isSimlet || simlet.url) {
            reg(simlet);
        } else {
            Ext.Object.each(simlet, function (url, s) {
                s.url = url;
                reg(s);
            });
        }

        return me;
    }
});

