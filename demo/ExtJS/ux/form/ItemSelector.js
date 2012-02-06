/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/*
 * Note that this control will most likely remain as an example, and not as a core Ext form
 * control.  However, the API will be changing in a future release and so should not yet be
 * treated as a final, stable API at this time.
 */

/**
 * @class Ext.ux.form.ItemSelector
 * @extends Ext.form.field.Base
 * A control that allows selection of between two Ext.ux.form.MultiSelect controls.
 *
 *  @history
 *    2008-06-19 bpm Original code contributed by Toby Stuart (with contributions from Robert Williams)
 *
 * @constructor
 * Create a new ItemSelector
 * @param {Object} config Configuration options
 * @xtype itemselector 
 */
Ext.define('Ext.ux.form.ItemSelector', {
    extend: 'Ext.ux.form.MultiSelect',
    alias: ['widget.itemselectorfield', 'widget.itemselector'],
    alternateClassName: ['Ext.ux.ItemSelector'],
    requires: ['Ext.ux.layout.component.form.ItemSelector', 'Ext.button.Button'],
    
    hideNavIcons:false,

    /**
     * @cfg {Array} buttons Defines the set of buttons that should be displayed in between the ItemSelector
     * fields. Defaults to <tt>['top', 'up', 'add', 'remove', 'down', 'bottom']</tt>. These names are used
     * to build the button CSS class names, and to look up the button text labels in {@link #buttonsText}.
     * This can be overridden with a custom Array to change which buttons are displayed or their order.
     */
    buttons: ['top', 'up', 'add', 'remove', 'down', 'bottom'],

    buttonsText: {
        top: "Move to Top",
        up: "Move Up",
        add: "Add to Selected",
        remove: "Remove from Selected",
        down: "Move Down",
        bottom: "Move to Bottom"
    },

    /**
     * @cfg {Array} multiselects An optional array of {@link Ext.ux.form.MultiSelect} config objects, containing
     * additional configuration to be applied to the internal MultiSelect fields.
     */
    multiselects: [],

    componentLayout: 'itemselectorfield',

    fieldBodyCls: Ext.baseCSSPrefix + 'form-itemselector-body',


    bindStore: function(store, initial) {
        var me = this,
            toField = me.toField,
            fromField = me.fromField,
            models;

        me.callParent(arguments);

        if (toField) {
            // Clear both field stores
            toField.store.removeAll();
            fromField.store.removeAll();

            // Clone the contents of the main store into the fromField
            models = [];
            me.store.each(function(model) {
                models.push(model.copy(model.getId()));
            });
            fromField.store.add(models);
        }
    },

    onRender: function(ct, position) {
        var me = this,
            baseCSSPrefix = Ext.baseCSSPrefix,
            ddGroup = 'ItemSelectorDD-' + Ext.id(),
            commonConfig = {
                displayField: me.displayField,
                valueField: me.valueField,
                dragGroup: ddGroup,
                dropGroup: ddGroup,
                flex: 1,
                hideLabel: true,
                disabled: me.disabled
            },
            fromConfig = Ext.apply({
                listTitle: 'Available',
                store: Ext.create('Ext.data.Store', {model: me.store.model}), //blank store to begin
                listeners: {
                    boundList: {
                        itemdblclick: me.onItemDblClick,
                        scope: me
                    }
                }
            }, me.multiselects[0], commonConfig),
            toConfig = Ext.apply({
                listTitle: 'Selected',
                store: Ext.create('Ext.data.Store', {model: me.store.model}), //blank store to begin
                listeners: {
                    boundList: {
                        itemdblclick: me.onItemDblClick,
                        scope: me
                    },
                    change: me.onToFieldChange,
                    scope: me
                }
            }, me.multiselects[1], commonConfig),
            fromField = Ext.widget('multiselect', fromConfig),
            toField = Ext.widget('multiselect', toConfig),
            innerCt,
            buttons = [];

        // Skip MultiSelect's onRender as we don't want its content
        Ext.ux.form.MultiSelect.superclass.onRender.call(me, ct, position);

        me.fromField = fromField;
        me.toField = toField;

        if (!me.hideNavIcons) {
            Ext.Array.forEach(me.buttons, function(name) {
                buttons.push({
                    xtype: 'button',
                    tooltip: me.buttonsText[name],
                    handler: me['on' + Ext.String.capitalize(name) + 'BtnClick'],
                    cls: baseCSSPrefix + 'form-itemselector-btn',
                    iconCls: baseCSSPrefix + 'form-itemselector-' + name,
                    scope: me
                });
                //div separator to force vertical stacking
                buttons.push({xtype: 'component', height: 3, width: 1, style: 'font-size:0;line-height:0'});
            });
        }

        innerCt = me.innerCt = Ext.widget('container', {
            renderTo: me.bodyEl,
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [
                me.fromField,
                {
                    xtype: 'container',
                    margins: '0 4',
                    items: buttons
                },
                me.toField
            ]
        });

        // Must set upward link after first render
        innerCt.ownerCt = me;

        // Rebind the store so it gets cloned to the fromField
        me.bindStore(me.store);

        // Set the initial value
        me.setRawValue(me.rawValue);
    },
    
    onToFieldChange: function() {
        this.checkChange();
    },
    
    getSelections: function(list){
        var store = list.getStore(),
            selections = list.getSelectionModel().getSelection(),
            i = 0,
            len = selections.length;
            
        return Ext.Array.sort(selections, function(a, b){
            a = store.indexOf(a);
            b = store.indexOf(b);
            
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            }
            return 0;
        });
    },

    onTopBtnClick : function() {
        var list = this.toField.boundList,
            store = list.getStore(),
            selected = this.getSelections(list),
            i = selected.length - 1,
            selection;
        
        
        store.suspendEvents();
        for (; i > -1; --i) {
            selection = selected[i];
            store.remove(selected);
            store.insert(0, selected);
        }
        store.resumeEvents();
        list.refresh();    
    },

    onBottomBtnClick : function() {
        var list = this.toField.boundList,
            store = list.getStore(),
            selected = this.getSelections(list),
            i = 0,
            len = selected.length,
            selection;
            
        store.suspendEvents();
        for (; i < len; ++i) {
            selection = selected[i];
            store.remove(selection);
            store.add(selection);
        }
        store.resumeEvents();
        list.refresh();
    },

    onUpBtnClick : function() {
        var list = this.toField.boundList,
            store = list.getStore(),
            selected = this.getSelections(list),
            i = 0,
            len = selected.length,
            selection,
            index;
            
        store.suspendEvents();
        for (; i < len; ++i) {
            selection = selected[i];
            index = Math.max(0, store.indexOf(selection) - 1);
            store.remove(selection);
            store.insert(index, selection);
        }
        store.resumeEvents();
        list.refresh();
    },

    onDownBtnClick : function() {
        var list = this.toField.boundList,
            store = list.getStore(),
            selected = this.getSelections(list),
            i = 0,
            len = selected.length,
            max = store.getCount(),
            selection,
            index;
            
        store.suspendEvents();
        for (; i < len; ++i) {
            selection = selected[i];
            index = Math.min(max, store.indexOf(selection) + 1);
            store.remove(selection);
            store.insert(index, selection);
        }
        store.resumeEvents();
        list.refresh();
    },

    onAddBtnClick : function() {
        var me = this,
            fromList = me.fromField.boundList,
            selected = this.getSelections(fromList);
            
        fromList.getStore().remove(selected);
        this.toField.boundList.getStore().add(selected);
    },

    onRemoveBtnClick : function() {
        var me = this,
            toList = me.toField.boundList,
            selected = this.getSelections(toList);
            
        toList.getStore().remove(selected);
        this.fromField.boundList.getStore().add(selected);
    },

    onItemDblClick : function(view) {
        var me = this;
        if (view == me.toField.boundList){
            me.onRemoveBtnClick();
        }
        else if (view == me.fromField.boundList) {
            me.onAddBtnClick();
        }
    },

    setRawValue: function(value) {
        var me = this,
            Array = Ext.Array,
            toStore, fromStore, models;

        value = Array.from(value);
        me.rawValue = value;

        if (me.toField) {
            toStore = me.toField.boundList.getStore();
            fromStore = me.fromField.boundList.getStore();

            // Move any selected values back to the fromField
            fromStore.add(toStore.getRange());
            toStore.removeAll();

            // Move the new values over to the toField
            models = [];
            Ext.Array.forEach(value, function(val) {
                var undef,
                    model = fromStore.findRecord(me.valueField, val, undef, undef, true, true);
                if (model) {
                    models.push(model);
                }
            });
            fromStore.remove(models);
            toStore.add(models);
        }

        return value;
    },

    getRawValue: function() {
        var me = this,
            toField = me.toField,
            rawValue = me.rawValue;

        if (toField) {
            rawValue = Ext.Array.map(toField.boundList.getStore().getRange(), function(model) {
                return model.get(me.valueField);
            });
        }

        me.rawValue = rawValue;
        return rawValue;
    },

    /**
     * @private Cascade readOnly/disabled state to the sub-fields and buttons
     */
    updateReadOnly: function() {
        var me = this,
            readOnly = me.readOnly || me.disabled;

        if (me.rendered) {
            me.toField.setReadOnly(readOnly);
            me.fromField.setReadOnly(readOnly);
            Ext.Array.forEach(me.innerCt.query('button'), function(button) {
                button.setDisabled(readOnly);
            });
        }
    },
    
    onDisable: function(){
        this.callParent();
        var fromField = this.fromField;
        
        // if we have one, we have both, they get created at the same time    
        if (fromField) {
            fromField.disable();
            this.toField.disable();
        }
    },
    
    onEnable: function(){
        this.callParent();
        var fromField = this.fromField;
        
        // if we have one, we have both, they get created at the same time    
        if (fromField) {
            fromField.enable();
            this.toField.enable();
        }
    },

    onDestroy: function() {
        Ext.destroyMembers(this, 'innerCt');
        this.callParent();
    }

});

