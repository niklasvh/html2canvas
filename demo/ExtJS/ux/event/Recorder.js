/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
Ext.define('Ext.ux.event.Recorder', {
    extend: 'Ext.ux.event.Driver',

    eventsToRecord: function () {
        var //key = { modKeys: true, key: true },
            mouse = { button: true, modKeys: true, xy: true };

        return {
            //keydown: key,
            //keypress: key,
            //keyup: key,

            //mousemove: mouse,
            //mouseover: mouse,
            //mouseout: mouse,
            click: mouse,
            //mousewheel: Ext.apply({ wheel: true }, mouse),
            mousedown: mouse,
            mouseup: mouse
        };
    }(),

    ignoreIdRegEx: /ext-gen(?:\d+)/,

    constructor: function (config) {
        var me = this,
            events = config && config.eventsToRecord;

        if (events) {
            me.eventsToRecord = Ext.apply(Ext.apply({}, me.eventsToRecord), // duplicate
                                    events); // and merge
            delete config.eventsToRecord; // don't smash
        }

        me.callParent(arguments);

        me.clear();
        me.modKeys = [];
    },

    clear: function () {
        this.events = [];
    },

    coalesce: function (rec) {
        var me = this,
            events = me.events,
            length = events.length,
            tail = length && events[length-1];

        if (tail && tail.type == 'mousemove' && rec.type == 'mousemove') {
            if (rec.ts - tail.ts < 200) {
                events[length-1] = rec;
                return true;
            }
        }

        return false;
    },

    getElementXPath: function (el) {
        var me = this,
            good = false,
            xpath = [],
            count,
            sibling,
            t,
            tag;

        for (t = el; t; t = t.parentNode) {
            if (t == document.body) {
                xpath.unshift('~');
                good = true;
                break;
            }
            if (t.id && !me.ignoreIdRegEx.test(t.id)) {
                xpath.unshift('#' + t.id);
                good = true;
                break;
            }

            for (count = 1, sibling = t; !!(sibling = sibling.previousSibling); ) {
                if (sibling.tagName == t.tagName) {
                    ++count;
                }
            }

            tag = t.tagName.toLowerCase();
            if (count < 2) {
                xpath.unshift(tag);
            } else {
                xpath.unshift(tag + '[' + count + ']');
            }
        }

        return good ? xpath.join('/') : null;
    },

    onEvent: function (e) {
        var me = this,
            info = me.eventsToRecord[e.type],
            modKeys,
            rec = {
                type: e.type,
                ts: me.getTimestamp(),
                target: me.getElementXPath(e.target)
            };

        if (!rec.target) {
            return;
        }

        if (info.xy) {
            rec.xy = e.getXY();
        }

        if (info.button) {
            rec.button = e.button;
        }

        if (info.wheel) {
            rec.wheel = e.getWheelDelta();
        }

        if (info.modKeys) {
            me.modKeys[0] = e.altKey ? 'A' : '';
            me.modKeys[1] = e.ctrlKey ? 'C' : '';
            me.modKeys[2] = e.metaKey ? 'M' : '';
            me.modKeys[3] = e.shiftKey ? 'S' : '';

            modKeys = me.modKeys.join('');
            if (modKeys) {
                rec.modKeys = modKeys;
            }
        }

        if (info.key) {
            rec.charCode = e.getCharCode();
            rec.keyCode = e.getKey();
        }

        if (!me.coalesce(rec)) {
            me.events.push(rec);
        }
        Ext.log('record: ' + Ext.encode(rec));
    },

    onStart: function () {
        var me = this,
            on = {
                scope: me
            },
            ddm = Ext.dd.DragDropManager,
            evproto = Ext.EventObjectImpl.prototype;

        Ext.Object.each(me.eventsToRecord, function (name, value) {
            if (value) {
                on[name] = me.onEvent;
            }
        });

        me.ddmStopEvent = ddm.stopEvent;
        ddm.stopEvent = Ext.Function.createSequence(ddm.stopEvent, function (e) {
            me.onEvent(e);
        });
        me.evStopEvent = evproto.stopEvent;
        evproto.stopEvent = Ext.Function.createSequence(evproto.stopEvent, function () {
            me.onEvent(this);
        });

        Ext.getBody().on(on);
    },

    onStop: function () {
        var me = this,
            body = Ext.getBody();

        Ext.Object.each(me.eventsToRecord, function (name, value) {
            if (value) {
                body.un(name, me.onEvent, me);
            }
        });

        Ext.dd.DragDropManager.stopEvent = me.ddmStopEvent;
        Ext.EventObjectImpl.prototype.stopEvent = me.evStopEvent;
    }
});

