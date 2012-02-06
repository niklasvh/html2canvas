/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
 * @class FeedViewer.FeedWindow
 * @extends Ext.window.Window
 *
 * Shows a dialog for creating and validating a new feed.
 * 
 * @constructor
 * Create a new Feed Window
 * @param {Object} config The config object
 */

Ext.define('FeedViewer.FeedWindow', {
    extend: 'Ext.window.Window',
    
    alias: 'widget.feedwindow',

    plain: true,

    defaultFeeds: [
        ['http://rss.cnn.com/rss/edition.rss', 'CNN Top Stories'],
        ['http://sports.espn.go.com/espn/rss/news', 'ESPN Top News'],
        ['http://news.google.com/news?ned=us&topic=t&output=rss', 'Sci/Tech - Google News'],
        ['http://rss.news.yahoo.com/rss/software', 'Yahoo Software News']
    ],
    
    initComponent: function(){
        this.addEvents(
            /**
             * @event feedvalid
             * @param {FeedViewer.FeedWindow} this
             * @param {String} title
             * @param {String} url
             * @param {String} description
             */
            'feedvalid'
        );
        
        this.form = Ext.create('widget.form', {
            bodyPadding: '12 10 10',
            border: false,
            unstyled: true,
            items: [{
                anchor: '100%',
                itemId: 'feed',
                fieldLabel: 'Enter the URL of the feed to add',
                labelAlign: 'top',
                msgTarget: 'under',
                xtype: 'combo',
                store: this.defaultFeeds,
                getInnerTpl: function(){
                    return '<div class="feed-picker-url">{field1}</div><div class="feed-picker-title">{field2}</div>'; 
                }
            }]
        });
        Ext.apply(this, {
            width: 500,
            title: 'Add Feed',
            iconCls: 'feed',
            layout: 'fit',
            items: this.form,
            buttons: [{
                xtype: 'button',
                text: 'Add Feed',
                scope: this,
                handler: this.onAddClick
            }, {
                xtype: 'button',
                text: 'Cancel',
                scope: this,
                handler: this.destroy
            }]
        });
        this.callParent(arguments);
    },
    
    /**
     * React to the add button being clicked.
     * @private
     */
    onAddClick: function(){
        var url = this.form.getComponent('feed').getValue();
        this.form.setLoading({
            msg: 'Validating feed...'
        });
        Ext.Ajax.request({
            url: 'feed-proxy.php',
            params: {
                feed: url
            },
            success: this.validateFeed,
            failure: this.markInvalid,
            scope: this
        });
    },
    
    /**
     * React to the feed validation passing
     * @private
     * @param {Object} response The response object
     */
    validateFeed: function(response){
        this.form.setLoading(false);
        
        var dq = Ext.DomQuery,
            url = this.form.getComponent('feed').getValue(),
            xml,
            channel,
            title;

        try {
            xml = response.responseXML;
            channel = xml.getElementsByTagName('channel')[0];
            if (channel) {
                title = dq.selectValue('title', channel, url);
                this.fireEvent('feedvalid', this, title, url);
                this.destroy();
                return;
            }
        } catch(e) {
        }
        this.markInvalid();
        
    },
    
    /**
     * React to the feed validation failing
     * @private
     */
    markInvalid: function(){
        this.form.setLoading(false);
        this.form.getComponent('feed').markInvalid('The URL specified is not a valid RSS2 feed.');
    }
});
