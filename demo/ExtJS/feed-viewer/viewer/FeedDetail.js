/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
 * @class FeedViewer.FeedDetail
 * @extends Ext.panel.Panel
 *
 * Shows the details of a particular feed
 * 
 * @constructor
 * Create a new Feed Detail
 * @param {Object} config The config object
 */
Ext.define('FeedViewer.FeedDetail', {

    extend: 'Ext.panel.Panel',
    alias: 'widget.feeddetail',

    border: false,
    
    initComponent: function(){
        this.display = Ext.create('widget.feedpost', {});
        Ext.apply(this, {
            layout: 'border',
            items: [this.createGrid(), this.createSouth(), this.createEast()]
        });
        this.relayEvents(this.display, ['opentab']);
        this.relayEvents(this.grid, ['rowdblclick']);
        this.callParent(arguments);
    },

    /**
     * Loads a feed.
     * @param {String} url
     */
    loadFeed: function(url){
        this.grid.loadFeed(url);
    },

    /**
     * Creates the feed grid
     * @private
     * @return {FeedViewer.FeedGrid} feedGrid
     */
    createGrid: function(){
        this.grid = Ext.create('widget.feedgrid', {
            region: 'center',
            dockedItems: [this.createTopToolbar()],
            flex: 2,
            minHeight: 200,
            minWidth: 150,
            listeners: {
                scope: this,
                select: this.onSelect
            }
        });
        this.loadFeed(this.url);
        return this.grid;
    },

    /**
     * Fires when a grid row is selected
     * @private
     * @param {FeedViewer.FeedGrid} grid
     * @param {Ext.data.Model} rec
     */
    onSelect: function(grid, rec) {
        this.display.setActive(rec);
    },

    /**
     * Creates top controller toolbar.
     * @private
     * @return {Ext.toolbar.Toolbar} toolbar
     */
    createTopToolbar: function(){
        this.toolbar = Ext.create('widget.toolbar', {
            cls: 'x-docked-noborder-top',
            items: [{
                iconCls: 'open-all',
                text: 'Open All',
                scope: this,
                handler: this.onOpenAllClick
            }, '-', {
                xtype: 'cycle',
                text: 'Reading Pane',
                prependText: 'Preview: ',
                showText: true,
                scope: this,
                changeHandler: this.readingPaneChange,
                menu: {
                    id: 'reading-menu',
                    items: [{
                        text: 'Bottom',
                        checked: true,
                        iconCls:'preview-bottom'
                    }, {
                        text: 'Right',
                        iconCls:'preview-right'
                    }, {
                        text: 'Hide',
                        iconCls:'preview-hide'
                    }]
                }
            }, {
                iconCls: 'summary',
                text: 'Summary',
                enableToggle: true,
                pressed: true,
                scope: this,
                toggleHandler: this.onSummaryToggle
            }]
        });
        return this.toolbar;
    },

    /**
     * Reacts to the open all being clicked
     * @private
     */
    onOpenAllClick: function(){
        this.fireEvent('openall', this);
    },

    /**
     * Gets a list of titles/urls for each feed.
     * @return {Array} The feed details
     */
    getFeedData: function(){
        return this.grid.store.getRange();
    },

    /**
     * @private
     * @param {Ext.button.Button} button The button
     * @param {Boolean} pressed Whether the button is pressed
     */
    onSummaryToggle: function(btn, pressed) {
        this.grid.getComponent('view').getPlugin('preview').toggleExpanded(pressed);
    },

    /**
     * Handle the checked item being changed
     * @private
     * @param {Ext.menu.CheckItem} item The checked item
     */
    readingPaneChange: function(cycle, activeItem){
        switch (activeItem.text) {
            case 'Bottom':
                this.east.hide();
                this.south.show();
                this.south.add(this.display);
                break;
            case 'Right':
                this.south.hide();
                this.east.show();
                this.east.add(this.display);
                break;
            default:
                this.south.hide();
                this.east.hide();
                break;
        }
    },

    /**
     * Create the south region container
     * @private
     * @return {Ext.panel.Panel} south
     */
    createSouth: function(){
        this.south =  Ext.create('Ext.container.Container', {
            layout: 'fit',
            region: 'south',
            split: true,
            flex: 2,
            minHeight: 150,
            items: this.display
        });
        return this.south;
    },

    /**
     * Create the east region container
     * @private
     * @return {Ext.panel.Panel} east
     */
    createEast: function(){
        this.east =  Ext.create('Ext.panel.Panel', {
            layout: 'fit',
            region: 'east',
            flex: 1,
            split: true,
            hidden: true,
            minWidth: 150,
            border: false
        });
        return this.east;
    }
});
