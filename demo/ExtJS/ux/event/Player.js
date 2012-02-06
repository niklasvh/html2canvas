/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
Ext.define('Ext.ux.event.Player', {
    extend: 'Ext.ux.event.Driver',

    speed: 1.0,

    tagPathRegEx: /(\w+)(?:\[(\d+)\])?/,

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        me.eventObject = new Ext.EventObjectImpl();
        me.timerFn = Ext.Function.bind(me.onTick, me);
    },

    getElementFromXPath: function (xpath) {
        var parts = xpath.split('/'),
            regex = this.tagPathRegEx,
            i, n, m, count, tag, child,
            el = (parts[0] == '~') ? document.body
                    : Ext.fly(parts[0].substring(1)).dom; // remove '#'

        for (i = 1, n = parts.length; el && i < n; ++i) {
            m = regex.exec(parts[i]);
            count = m[2] ? parseInt(m[2], 10) : 1;
            tag = m[1].toUpperCase();

            for (child = el.firstChild; child; child = child.nextSibling) {
                if (child.tagName == tag) {
                    if (count == 1) {
                        break;
                    }
                    --count;
                }
            }

            el = child;
        }

        return el;
    },

    onEnd: function () {},

    onStart: function () {
        this.schedule(0);
    },

    onStop: function () {
        var me = this;

        if (me.timer) {
            clearTimeout(me.timer);
            me.timer = null;
        }

        me.onEnd();
    },

    onTick: function () {
        var me = this,
            event,
            eventIndex = me.nextEvent,
            events = me.events,
            timeIndex = me.getTimestamp() * me.speed;

        me.timer = null;

        while (1) {
            event = events[eventIndex];

            if (event.ts > timeIndex) {
                me.schedule(eventIndex);
                break;
            }

            me.playEvent(event);

            if (++eventIndex == events.length) {
                me.stop();
                break;
            }
        }
    },

    playEvent: function (event) {
        var me = this,
            eventObject = me.eventObject,
            modKeys = event.modKeys || '',
            target = me.getElementFromXPath(event.target);

        if (target) {
            Ext.log('play: ' + Ext.encode(event));
            eventObject.type = event.type;
            eventObject.xy = event.xy || null;
            eventObject.button = event.button;

            if ('wheel' in event) {
                // see getWheelDelta
            }

            eventObject.altKey = modKeys.indexOf('A') > 0;
            eventObject.ctrlKey = modKeys.indexOf('C') > 0;
            eventObject.metaKey = modKeys.indexOf('M') > 0;
            eventObject.shiftKey = modKeys.indexOf('S') > 0;

            eventObject.injectEvent(target);
        } else {
            Ext.log('Cannot find: ', event.target);
        }
    },

    schedule: function (eventIndex) {
        var me = this;
        me.nextEvent = eventIndex;
        me.timer = setTimeout(me.timerFn, 10);
    }
});

