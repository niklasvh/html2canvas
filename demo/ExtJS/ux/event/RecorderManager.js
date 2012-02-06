/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
Ext.define('Ext.ux.event.RecorderManager', {

    uses: [
        'Ext.ux.event.Recorder',
        'Ext.ux.event.Player'
    ],

    statics: {
        recorder: null,

        show: function () {
            var me = Ext.ux.event.RecorderManager;

            if (me.window) {
                me.window.show();
            } else {
                me.recorder = new Ext.ux.event.Recorder();
                me.window = Ext.create('widget.window', {
                    width: 500,
                    height: 400,
                    autoShow: true,
                    title: 'Recorded Events',
                    maximizable: true,
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'textarea',
                            value: me.recorder && Ext.encode(me.recorder.events)
                        }
                    ],
                    buttons: [
                        {
                            xtype: 'tbtext',
                            text: 'Bookmarklets: '
                        },
                        {
                            xtype: 'component',
                            html: '<a href="javascript:Ext.ux.event.RecorderManager.stop();">Stop</a>'
                        },
                        { xtype: 'tbfill' },
                        {
                            text: 'Record',
                            handler: function () {
                                me.window.hide();
                                setTimeout(function () {
                                    me.recorder.start();
                                }, 500);
                            }
                        },
                        {
                            text: 'Play',
                            handler: function () {
                                me.window.hide();
                                var events = Ext.decode(me.window.items.items[0].getValue());
                                me.player = Ext.create('Ext.ux.event.Player', {
                                    events: events,
                                    onEnd: function () {
                                        me.player = null;
                                        me.window.show();
                                    }
                                });
                                me.player.start();
                            }
                        },
                        {
                            text: 'Clear',
                            handler: function () {
                                me.window.items.items[0].setValue('');
                                me.recorder.clear();
                            }
                        }
                    ]
                });
            }
        },

        stop: function () {
            var me = Ext.ux.event.RecorderManager;
            if (me.recorder) {
                me.recorder.stop();
                me.window.items.items[0].setValue(Ext.encode(me.recorder.events));
                me.window.show();
            }
        }
    }
});

