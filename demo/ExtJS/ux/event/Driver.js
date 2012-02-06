/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
Ext.define('Ext.ux.event.Driver', {
    active: null,

    constructor: function (config) {
        Ext.apply(this, config);
    },

    getTimestamp: function () {
        var d = new Date();
        return d.getTime() - this.startTime;
    },

    onStart: function () {},
    onStop: function () {},

    start: function () {
        var me = this;

        if (!me.active) {
            me.active = new Date();
            me.startTime = me.active.getTime();
            me.onStart();
        }
    },

    stop: function () {
        var me = this;

        if (me.active) {
            me.active = null;
            me.onStop();
        }
    }
});

