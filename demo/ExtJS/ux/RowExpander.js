/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
// feature idea to enable Ajax loading and then the content
// cache would actually make sense. Should we dictate that they use
// data or support raw html as well?

/**
 * @class Ext.ux.RowExpander
 * @extends Ext.AbstractPlugin
 * Plugin (ptype = 'rowexpander') that adds the ability to have a Column in a grid which enables
 * a second row body which expands/contracts.  The expand/contract behavior is configurable to react
 * on clicking of the column, double click of the row, and/or hitting enter while a row is selected.
 *
 * @ptype rowexpander
 */
Ext.define('Ext.ux.RowExpander', {
    extend: 'Ext.AbstractPlugin',

    requires: [
        'Ext.grid.feature.RowBody',
        'Ext.grid.feature.RowWrap'
    ],

    alias: 'plugin.rowexpander',

    rowBodyTpl: null,

    /**
     * @cfg {Boolean} expandOnEnter
     * <tt>true</tt> to toggle selected row(s) between expanded/collapsed when the enter
     * key is pressed (defaults to <tt>true</tt>).
     */
    expandOnEnter: true,

    /**
     * @cfg {Boolean} expandOnDblClick
     * <tt>true</tt> to toggle a row between expanded/collapsed when double clicked
     * (defaults to <tt>true</tt>).
     */
    expandOnDblClick: true,

    /**
     * @cfg {Boolean} selectRowOnExpand
     * <tt>true</tt> to select a row when clicking on the expander icon
     * (defaults to <tt>false</tt>).
     */
    selectRowOnExpand: false,

    rowBodyTrSelector: '.x-grid-rowbody-tr',
    rowBodyHiddenCls: 'x-grid-row-body-hidden',
    rowCollapsedCls: 'x-grid-row-collapsed',



    renderer: function(value, metadata, record, rowIdx, colIdx) {
        if (colIdx === 0) {
            metadata.tdCls = 'x-grid-td-expander';
        }
        return '<div class="x-grid-row-expander">&#160;</div>';
    },

    /**
     * @event expandbody
     * <b<Fired through the grid's View</b>
     * @param {HtmlElement} rowNode The &lt;tr> element which owns the expanded row.
     * @param {Ext.data.Model} record The record providing the data.
     * @param {HtmlElement} expandRow The &lt;tr> element containing the expanded data.
     */
    /**
     * @event collapsebody
     * <b<Fired through the grid's View.</b>
     * @param {HtmlElement} rowNode The &lt;tr> element which owns the expanded row.
     * @param {Ext.data.Model} record The record providing the data.
     * @param {HtmlElement} expandRow The &lt;tr> element containing the expanded data.
     */

    constructor: function() {
        this.callParent(arguments);
        var grid = this.getCmp();
        this.recordsExpanded = {};
        // <debug>
        if (!this.rowBodyTpl) {
            Ext.Error.raise("The 'rowBodyTpl' config is required and is not defined.");
        }
        // </debug>
        // TODO: if XTemplate/Template receives a template as an arg, should
        // just return it back!
        var rowBodyTpl = Ext.create('Ext.XTemplate', this.rowBodyTpl),
            features = [{
                ftype: 'rowbody',
                columnId: this.getHeaderId(),
                recordsExpanded: this.recordsExpanded,
                rowBodyHiddenCls: this.rowBodyHiddenCls,
                rowCollapsedCls: this.rowCollapsedCls,
                getAdditionalData: this.getRowBodyFeatureData,
                getRowBodyContents: function(data) {
                    return rowBodyTpl.applyTemplate(data);
                }
            },{
                ftype: 'rowwrap'
            }];

        if (grid.features) {
            grid.features = features.concat(grid.features);
        } else {
            grid.features = features;
        }

        // NOTE: features have to be added before init (before Table.initComponent)
    },

    init: function(grid) {
        this.callParent(arguments);

        // Columns have to be added in init (after columns has been used to create the
        // headerCt). Otherwise, shared column configs get corrupted, e.g., if put in the
        // prototype.
        grid.headerCt.insert(0, this.getHeaderConfig());
        grid.on('render', this.bindView, this, {single: true});
    },

    getHeaderId: function() {
        if (!this.headerId) {
            this.headerId = Ext.id();
        }
        return this.headerId;
    },

    getRowBodyFeatureData: function(data, idx, record, orig) {
        var o = Ext.grid.feature.RowBody.prototype.getAdditionalData.apply(this, arguments),
            id = this.columnId;
        o.rowBodyColspan = o.rowBodyColspan - 1;
        o.rowBody = this.getRowBodyContents(data);
        o.rowCls = this.recordsExpanded[record.internalId] ? '' : this.rowCollapsedCls;
        o.rowBodyCls = this.recordsExpanded[record.internalId] ? '' : this.rowBodyHiddenCls;
        o[id + '-tdAttr'] = ' valign="top" rowspan="2" ';
        if (orig[id+'-tdAttr']) {
            o[id+'-tdAttr'] += orig[id+'-tdAttr'];
        }
        return o;
    },

    bindView: function() {
        var view = this.getCmp().getView(),
            viewEl;

        if (!view.rendered) {
            view.on('render', this.bindView, this, {single: true});
        } else {
            viewEl = view.getEl();
            if (this.expandOnEnter) {
                this.keyNav = Ext.create('Ext.KeyNav', viewEl, {
                    'enter' : this.onEnter,
                    scope: this
                });
            }
            if (this.expandOnDblClick) {
                view.on('itemdblclick', this.onDblClick, this);
            }
            this.view = view;
        }
    },

    onEnter: function(e) {
        var view = this.view,
            ds   = view.store,
            sm   = view.getSelectionModel(),
            sels = sm.getSelection(),
            ln   = sels.length,
            i = 0,
            rowIdx;

        for (; i < ln; i++) {
            rowIdx = ds.indexOf(sels[i]);
            this.toggleRow(rowIdx);
        }
    },

    toggleRow: function(rowIdx) {
        var rowNode = this.view.getNode(rowIdx),
            row = Ext.get(rowNode),
            nextBd = Ext.get(row).down(this.rowBodyTrSelector),
            record = this.view.getRecord(rowNode),
            grid = this.getCmp();

        if (row.hasCls(this.rowCollapsedCls)) {
            row.removeCls(this.rowCollapsedCls);
            nextBd.removeCls(this.rowBodyHiddenCls);
            this.recordsExpanded[record.internalId] = true;
            this.view.fireEvent('expandbody', rowNode, record, nextBd.dom);
        } else {
            row.addCls(this.rowCollapsedCls);
            nextBd.addCls(this.rowBodyHiddenCls);
            this.recordsExpanded[record.internalId] = false;
            this.view.fireEvent('collapsebody', rowNode, record, nextBd.dom);
        }


        // If Grid is auto-heighting itself, then perform a component layhout to accommodate the new height
        if (!grid.isFixedHeight()) {
            grid.doComponentLayout();
        }
        this.view.up('gridpanel').invalidateScroller();
    },

    onDblClick: function(view, cell, rowIdx, cellIndex, e) {

        this.toggleRow(rowIdx);
    },

    getHeaderConfig: function() {
        var me                = this,
            toggleRow         = Ext.Function.bind(me.toggleRow, me),
            selectRowOnExpand = me.selectRowOnExpand;

        return {
            id: this.getHeaderId(),
            width: 24,
            sortable: false,
            resizable: false,
            draggable: false,
            hideable: false,
            menuDisabled: true,
            cls: Ext.baseCSSPrefix + 'grid-header-special',
            renderer: function(value, metadata) {
                metadata.tdCls = Ext.baseCSSPrefix + 'grid-cell-special';

                return '<div class="' + Ext.baseCSSPrefix + 'grid-row-expander">&#160;</div>';
            },
            processEvent: function(type, view, cell, recordIndex, cellIndex, e) {
                if (type == "mousedown" && e.getTarget('.x-grid-row-expander')) {
                    var row = e.getTarget('.x-grid-row');
                    toggleRow(row);
                    return selectRowOnExpand;
                }
            }
        };
    }
});

