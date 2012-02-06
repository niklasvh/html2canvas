/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
 * @author Nicolas Ferrero
 * @class Ext.ux.GroupTabPanel
 * @extends Ext.Container
 * A TabPanel with grouping support.
 */
Ext.define('Ext.ux.GroupTabPanel', {
    extend: 'Ext.Container',

    alias: 'widget.grouptabpanel',

    requires:[
        'Ext.data.*',
        'Ext.tree.*',
        'Ext.layout.*'
    ],

    baseCls : Ext.baseCSSPrefix + 'grouptabpanel',

    initComponent: function(config) {
        var me = this,
            items = [];

        Ext.apply(me, config);

        me.store = me.createItemsStore();
        me.layout = {
            type: 'hbox',
            pack: 'start',
            align: 'stretch'
        };
        me.defaults = {
            border: false
        };

        me.items = Ext.each(me.items, function(item) {
            items.push(item.items);
        });

        me.items = [{
            xtype: 'treepanel',
            cls: 'x-tree-panel x-grouptabbar',
            width: 150,
            rootVisible: false,
            height: 400,
            store: me.store,
            hideHeaders: true,
            useArrows: true,
            animate: false,
            viewConfig: {
                overItemCls: ''
            },
            columns: [{
                xtype: 'treecolumn',
                sortable: false,
                dataIndex: 'text',
                flex: 1,
                renderer: function (value, cell, node, idx1, idx2, store, tree) {
                    var cls = '';

                    if (!node.data.activeGroup) {
                        cls += ' x-inactive-group';
                    } else if (node.parentNode && node.parentNode.parentNode === null) {
                        cls += ' x-grouptab-first';
                        if (node.previousSibling) {
                            cls += ' x-grouptab-prev';
                        }
                    } else if (node.nextSibling === null) {
                        cls += ' x-grouptab-last';
                    } else {
                        cls += ' x-grouptab-center';
                    }
                    if (node.data.activeTab) {
                            cls += ' x-active-tab';
                    }
                    cell.tdCls= 'x-grouptab'+ cls;

                    return value;
                }
             }]
        },{
            xtype: 'container',
            flex: 1,
            layout: 'card',
            activeItem: me.mainItem,
            baseCls: Ext.baseCSSPrefix + 'grouptabcontainer',
            items: items
        }];

        me.addEvents(
            /**
             * @event beforetabchange
             * Fires before a tab change (activated by {@link #setActiveTab}). Return false in any listener to cancel
             * the tabchange
             * @param {Ext.ux.GroupTabPanel} grouptabPanel The GroupTabPanel
             * @param {Ext.Component} newCard The card that is about to be activated
             * @param {Ext.Component} oldCard The card that is currently active
             */
            'beforetabchange',

            /**
             * @event tabchange
             * Fires when a new tab has been activated (activated by {@link #setActiveTab}).
             * @param {Ext.ux.GroupTabPanel} grouptabPanel The GroupTabPanel
             * @param {Ext.Component} newCard The newly activated item
             * @param {Ext.Component} oldCard The previously active item
             */
            'tabchange',

            /**
             * @event beforegroupchange
             * Fires before a group change (activated by {@link #setActiveGroup}). Return false in any listener to cancel
             * the groupchange
             * @param {Ext.ux.GroupTabPanel} grouptabPanel The GroupTabPanel
             * @param {Ext.Component} newGroup The root group card that is about to be activated
             * @param {Ext.Component} oldGroup The root group card that is currently active
             */
            'beforegroupchange',

            /**
             * @event groupchange
             * Fires when a new group has been activated (activated by {@link #setActiveGroup}).
             * @param {Ext.ux.GroupTabPanel} grouptabPanel The GroupTabPanel
             * @param {Ext.Component} newGroup The newly activated root group item
             * @param {Ext.Component} oldGroup The previously active root group item
             */
            'groupchange'
        );

        me.callParent(arguments);
        me.setActiveTab(me.activeTab);
        me.setActiveGroup(me.activeGroup);
        me.mon(me.down('treepanel').getSelectionModel(), 'select', me.onNodeSelect, me);
    },

    /**
     * @private
     * Node selection listener.
     */
    onNodeSelect: function (selModel, node) {
        var me = this,
            currentNode = me.store.getRootNode(),
            parent;

        if (node.parentNode && node.parentNode.parentNode === null) {
            parent = node;
        } else {
            parent = node.parentNode;
        }

        if (me.setActiveGroup(parent.get('id')) === false || me.setActiveTab(node.get('id')) === false) {
            return false;
        }

        while(currentNode) {
            currentNode.set('activeTab', false);
            currentNode.set('activeGroup', false);
            currentNode = currentNode.firstChild || currentNode.nextSibling || currentNode.parentNode.nextSibling;
        }

        parent.set('activeGroup', true);

        parent.eachChild(function(child) {

            child.set('activeGroup', true);
        });
        node.set('activeTab', true);
        selModel.view.refresh();
    },

    /**
     * Makes the given component active (makes it the visible card in the GroupTabPanel's CardLayout)
     * @param {Ext.Component} cmp The component to make active
     */
    setActiveTab: function(cmp) {
        var me = this,
            newTab = cmp,
            oldTab;

        if(Ext.isString(cmp)) {
            newTab = Ext.getCmp(newTab);
        }

        if (newTab === me.activeTab) {
            return false;
        }

        oldTab = me.activeTab;
        if (me.fireEvent('beforetabchange', me, newTab, oldTab) !== false) {
             me.activeTab = newTab;
             if (me.rendered) {
                 me.down('container[baseCls=' + Ext.baseCSSPrefix + 'grouptabcontainer' + ']').getLayout().setActiveItem(newTab);
             }
             me.fireEvent('tabchange', me, newTab, oldTab);
         }
         return true;
    },

    /**
     * Makes the given group active
     * @param {Ext.Component} cmp The root component to make active.
     */
    setActiveGroup: function(cmp) {
        var me = this,
            newGroup = cmp,
            oldGroup;

        if(Ext.isString(cmp)) {
            newGroup = Ext.getCmp(newGroup);
        }

        if (newGroup === me.activeGroup) {
            return true;
        }

        oldGroup = me.activeGroup;
        if (me.fireEvent('beforegroupchange', me, newGroup, oldGroup) !== false) {
             me.activeGroup = newGroup;
             me.fireEvent('groupchange', me, newGroup, oldGroup);
         } else {
             return false;
         }
         return true;
    },

    /**
     * @private
     * Creates the TreeStore used by the GroupTabBar.
     */
    createItemsStore: function() {
        var me = this,
            data = {
            text:'.',
            children: []
        };
        me.activeGroup = me.activeGroup || 0;

        Ext.each(me.items, function(item, idx){
            var items = item.items,
                rootItem = (items[item.mainItem] || items[0]),
                root = {
                    children: []
                };

            if (!rootItem.id) {
                rootItem.id = Ext.id();
            }

            root.id = rootItem.id;
            root.text = rootItem.title;
            root.iconCls = rootItem.iconCls;
            delete rootItem.iconCls;
            delete rootItem.title;
            root.expanded = true;
            root.activeGroup = (me.activeGroup === idx);
            root.activeTab = root.activeGroup ? true : false;
            if (root.activeTab) {
                me.activeTab = root.id;
            }

            if (root.activeGroup) {
                me.mainItem = item.mainItem || 0;
                me.activeGroup = root.id;
            }

            Ext.each(item.items, function(childItem) {
                if (!childItem.id) {
                    childItem.id = Ext.id();
                }
                if(childItem.id !== root.id) {
                    var child = {
                        id: childItem.id,
                        leaf: true,
                        text: childItem.title,
                        iconCls: childItem.iconCls,
                        activeTab: false
                    };
                    delete childItem.title;
                    delete childItem.iconCls;

                    child.activeGroup = root.activeGroup;
                    root.children.push(child);
                }
            }, me);

            data.children.push(root);

      }, me);

       return Ext.create('Ext.data.TreeStore', {
            fields: ['id', 'text', 'activeGroup', 'activeTab'],
            root: {expanded: true},
            proxy: {
                type: 'memory',
                data: data
            }
        });
    },

    /**
     * Returns the item that is currently active inside this GroupTabPanel.
     * @return {Ext.Component/Integer} The currently active item
     */
    getActiveTab: function() {
        return this.activeTab;
    },

    /**
     * Returns the root group item that is currently active inside this GroupTabPanel.
     * @return {Ext.Component/Integer} The currently active root group item
     */
    getActiveGroup: function() {
        return this.activeGroup;
    }
});

