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
 * @class Ext.ux.ajax.SimXhr
 *
 * Simulates an XMLHttpRequest object's methods and properties but is backed by a
 * {@link Simlet} instance that provides the data.
 */
Ext.define('Ext.ux.ajax.SimXhr', {
    readyState: 0,

    mgr: null,
    simlet: null,

    constructor: function (config) {
        var me = this;

        Ext.apply(me, config);
        me.requestHeaders = {};
    },

    abort: function () {
        var me = this;

        if (me.timer) {
            clearTimeout(me.timer);
            me.timer = null;
        }
        me.aborted = true;
    },

    getAllResponseHeaders: function () {
        var headers = [];
        Ext.Object.each(this.responseHeaders, function (name, value) {
            headers.push(name + ': ' + value);
        });
        return headers.join('\x0d\x0a');
    },

    getResponseHeader: function (header) {
        var headers = this.responseHeaders;
        return (headers && headers[header]) || null;
    },

    open: function (method, url, async, user, password) {
        var me = this;
        me.method = method;
        me.url = url;
        me.async = async !== false;
        me.user = user;
        me.password = password;

        me.setReadyState(1);
    },

    overrideMimeType: function (mimeType) {
        this.mimeType = mimeType;
    },

    schedule: function () {
        var me = this;
        me.timer = setTimeout(function () {
            me.onTick();
        }, me.mgr.delay);
    },

    send: function (body) {
        var me = this;

        me.body = body;

        if (me.async) {
            me.schedule();
        } else {
            me.onComplete();
        }
    },

    setReadyState: function (state) {
        var me = this;
        if (me.readyState != state) {
            me.readyState = state;
            me.onreadystatechange();
        }
    },

    setRequestHeader: function (header, value) {
        this.requestHeaders[header] = value;
    },

    // handlers

    onreadystatechange: Ext.emptyFn,

    onComplete: function () {
        var me = this;

        me.readyState = 4;
        Ext.apply(me, me.simlet.exec(me));
    },

    onTick: function () {
        var me = this;

        me.timer = null;
        me.onComplete();
        me.onreadystatechange();
    }
});

