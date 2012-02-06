/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
 * @class Ext.ux.form.MultiSelect
 * @extends Ext.form.field.Base
 * A control that allows selection and form submission of multiple list items.
 *
 *  @history
 *    2008-06-19 bpm Original code contributed by Toby Stuart (with contributions from Robert Williams)
 *    2008-06-19 bpm Docs and demo code clean up
 *
 * @constructor
 * Create a new MultiSelect
 * @param {Object} config Configuration options
 * @xtype multiselect
 */
Ext.define('Ext.ux.form.MultiSelect', {
    extend: 'Ext.form.field.Base',
    alternateClassName: 'Ext.ux.Multiselect',
    alias: ['widget.multiselect', 'widget.multiselectfield'],
    uses: [
        'Ext.view.BoundList',
        'Ext.form.FieldSet',
        'Ext.ux.layout.component.form.MultiSelect',
        'Ext.view.DragZone',
        'Ext.view.DropZone'
    ],

    /**
     * @cfg {String} listTitle An optional title to be displayed at the top of the selection list.
     */

    /**
     * @cfg {String/Array} dragGroup The ddgroup name(s) for the MultiSelect DragZone (defaults to undefined).
     */

    /**
     * @cfg {String/Array} dropGroup The ddgroup name(s) for the MultiSelect DropZone (defaults to undefined).
     */

    /**
     * @cfg {Boolean} ddReorder Whether the items in the MultiSelect list are drag/drop reorderable (defaults to false).
     */
    ddReorder: false,

    /**
     * @cfg {Object/Array} tbar An optional toolbar to be inserted at the top of the control's selection list.
     * This can be a {@link Ext.toolbar.Toolbar} object, a toolbar config, or an array of buttons/button configs
     * to be added to the toolbar. See {@link Ext.panel.Panel#tbar}.
     */

    /**
     * @cfg {String} appendOnly True if the list should only allow append drops when drag/drop is enabled
     * (use for lists which are sorted, defaults to false).
     */
    appendOnly: false,

    /**
     * @cfg {String} displayField Name of the desired display field in the dataset (defaults to 'text').
     */
    displayField: 'text',

    /**
     * @cfg {String} valueField Name of the desired value field in the dataset (defaults to the
     * value of {@link #displayField}).
     */

    /**
     * @cfg {Boolean} allowBlank False to require at least one item in the list to be selected, true to allow no
     * selection (defaults to true).
     */
    allowBlank: true,

    /**
     * @cfg {Number} minSelections Minimum number of selections allowed (defaults to 0).
     */
    minSelections: 0,

    /**
     * @cfg {Number} maxSelections Maximum number of selections allowed (defaults to Number.MAX_VALUE).
     */
    maxSelections: Number.MAX_VALUE,

    /**
     * @cfg {String} blankText Default text displayed when the control contains no items (defaults to 'This field is required')
     */
    blankText: 'This field is required',

    /**
     * @cfg {String} minSelectionsText Validation message displayed when {@link #minSelections} is not met (defaults to 'Minimum {0}
     * item(s) required').  The {0} token will be replaced by the value of {@link #minSelections}.
     */
    minSelectionsText: 'Minimum {0} item(s) required',

    /**
     * @cfg {String} maxSelectionsText Validation message displayed when {@link #maxSelections} is not met (defaults to 'Maximum {0}
     * item(s) allowed').  The {0} token will be replaced by the value of {@link #maxSelections}.
     */
    maxSelectionsText: 'Maximum {0} item(s) allowed',

    /**
     * @cfg {String} delimiter The string used to delimit the selected values when {@link #getSubmitValue submitting}
     * the field as part of a form. Defaults to ','. If you wish to have the selected values submitted as separate
     * parameters rather than a single delimited parameter, set this to <tt>null</tt>.
     */
    delimiter: ',',

    /**
     * @cfg {Ext.data.Store/Array} store The data source to which this MultiSelect is bound (defaults to <tt>undefined</tt>).
     * Acceptable values for this property are:
     * <div class="mdetail-params"><ul>
     * <li><b>any {@link Ext.data.Store Store} subclass</b></li>
     * <li><b>an Array</b> : Arrays will be converted to a {@link Ext.data.ArrayStore} internally.
     * <div class="mdetail-params"><ul>
     * <li><b>1-dimensional array</b> : (e.g., <tt>['Foo','Bar']</tt>)<div class="sub-desc">
     * A 1-dimensional array will automatically be expanded (each array item will be the combo
     * {@link #valueField value} and {@link #displayField text})</div></li>
     * <li><b>2-dimensional array</b> : (e.g., <tt>[['f','Foo'],['b','Bar']]</tt>)<div class="sub-desc">
     * For a multi-dimensional array, the value in index 0 of each item will be assumed to be the combo
     * {@link #valueField value}, while the value at index 1 is assumed to be the combo {@link #displayField text}.
     * </div></li></ul></div></li></ul></div>
     */

    componentLayout: 'multiselectfield',

    fieldBodyCls: Ext.baseCSSPrefix + 'form-multiselect-body',


    // private
    initComponent: function(){
        var me = this;

        me.bindStore(me.store, true);
        if (me.store.autoCreated) {
            me.valueField = me.displayField = 'field1';
            if (!me.store.expanded) {
                me.displayField = 'field2';
            }
        }

        if (!Ext.isDefined(me.valueField)) {
            me.valueField = me.displayField;
        }

        me.callParent();
    },

    bindStore: function(store, initial) {
        var me = this,
            oldStore = me.store,
            boundList = me.boundList;

        if (oldStore && !initial && oldStore !== store && oldStore.autoDestroy) {
            oldStore.destroyStore();
        }

        me.store = store ? Ext.data.StoreManager.lookup(store) : null;
        if (boundList) {
            boundList.bindStore(store || null);
        }
    },


    // private
    onRender: function(ct, position) {
        var me = this,
            panel, boundList, selModel;

        me.callParent(arguments);

        boundList = me.boundList = Ext.create('Ext.view.BoundList', {
            deferInitialRefresh: false,
            multiSelect: true,
            store: me.store,
            displayField: me.displayField,
            border: false,
            disabled: me.disabled
        });

        selModel = boundList.getSelectionModel();
        me.mon(selModel, {
            selectionChange: me.onSelectionChange,
            scope: me
        });

        panel = me.panel = Ext.create('Ext.panel.Panel', {
            title: me.listTitle,
            tbar: me.tbar,
            items: [boundList],
            renderTo: me.bodyEl,
            layout: 'fit'
        });

        // Must set upward link after first render
        panel.ownerCt = me;

        // Set selection to current value
        me.setRawValue(me.rawValue);
    },

    // No content generated via template, it's all added components
    getSubTplMarkup: function() {
        return '';
    },

    // private
    afterRender: function() {
        var me = this;
        me.callParent();

        if (me.ddReorder && !me.dragGroup && !me.dropGroup){
            me.dragGroup = me.dropGroup = 'MultiselectDD-' + Ext.id();
        }

        if (me.draggable || me.dragGroup){
            me.dragZone = Ext.create('Ext.view.DragZone', {
                view: me.boundList,
                ddGroup: me.dragGroup,
                dragText: '{0} Item{1}'
            });
        }
        if (me.droppable || me.dropGroup){
            me.dropZone = Ext.create('Ext.view.DropZone', {
                view: me.boundList,
                ddGroup: me.dropGroup,
                handleNodeDrop: function(data, dropRecord, position) {
                    var view = this.view,
                        store = view.getStore(),
                        records = data.records,
                        index;

                    // remove the Models from the source Store
                    data.view.store.remove(records);

                    index = store.indexOf(dropRecord);
                    if (position === 'after') {
                        index++;
                    }
                    store.insert(index, records);
                    view.getSelectionModel().select(records);
                }
            });
        }
    },

    onSelectionChange: function() {
        this.checkChange();
    },

    /**
     * Clears any values currently selected.
     */
    clearValue: function() {
        this.setValue([]);
    },

    /**
     * Return the value(s) to be submitted for this field. The returned value depends on the {@link #delimiter}
     * config: If it is set to a String value (like the default ',') then this will return the selected values
     * joined by the delimiter. If it is set to <tt>null</tt> then the values will be returned as an Array.
     */
    getSubmitValue: function() {
        var me = this,
            delimiter = me.delimiter,
            val = me.getValue();
        return Ext.isString(delimiter) ? val.join(delimiter) : val;
    },

    // inherit docs
    getRawValue: function() {
        var me = this,
            boundList = me.boundList;
        if (boundList) {
            me.rawValue = Ext.Array.map(boundList.getSelectionModel().getSelection(), function(model) {
                return model.get(me.valueField);
            });
        }
        return me.rawValue;
    },

    // inherit docs
    setRawValue: function(value) {
        var me = this,
            boundList = me.boundList,
            models;

        value = Ext.Array.from(value);
        me.rawValue = value;

        if (boundList) {
            models = [];
            Ext.Array.forEach(value, function(val) {
                var undef,
                    model = me.store.findRecord(me.valueField, val, undef, undef, true, true);
                if (model) {
                    models.push(model);
                }
            });
            boundList.getSelectionModel().select(models, false, true);
        }

        return value;
    },

    // no conversion
    valueToRaw: function(value) {
        return value;
    },

    // compare array values
    isEqual: function(v1, v2) {
        var fromArray = Ext.Array.from,
            i, len;

        v1 = fromArray(v1);
        v2 = fromArray(v2);
        len = v1.length;

        if (len !== v2.length) {
            return false;
        }

        for(i = 0; i < len; i++) {
            if (v2[i] !== v1[i]) {
                return false;
            }
        }

        return true;
    },

    getErrors : function(value) {
        var me = this,
            format = Ext.String.format,
            errors = me.callParent(arguments),
            numSelected;

        value = Ext.Array.from(value || me.getValue());
        numSelected = value.length;

        if (!me.allowBlank && numSelected < 1) {
            errors.push(me.blankText);
        }
        if (numSelected < this.minSelections) {
            errors.push(format(me.minSelectionsText, me.minSelections));
        }
        if (numSelected > this.maxSelections) {
            errors.push(format(me.maxSelectionsText, me.maxSelections));
        }

        return errors;
    },

    onDisable: function() {
        var me = this;
        
        me.callParent();
        me.updateReadOnly();
        if (me.boundList) {
            me.boundList.disable();
        }
    },

    onEnable: function() {
        var me = this;
        
        me.callParent();
        me.updateReadOnly();
        if (me.boundList) {
            me.boundList.enable();
        }
    },

    setReadOnly: function(readOnly) {
        this.readOnly = readOnly;
        this.updateReadOnly();
    },

    /**
     * @private Lock or unlock the BoundList's selection model to match the current disabled/readonly state
     */
    updateReadOnly: function() {
        var me = this,
            boundList = me.boundList,
            readOnly = me.readOnly || me.disabled;
        if (boundList) {
            boundList.getSelectionModel().setLocked(readOnly);
        }
    },

    onDestroy: function(){
        Ext.destroyMembers(this, 'panel', 'boundList', 'dragZone', 'dropZone');
        this.callParent();
    }
});



