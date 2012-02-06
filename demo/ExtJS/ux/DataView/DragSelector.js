/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
 * @class Ext.ux.DataView.DragSelector
 * @extends Object
 * @author Ed Spencer
 * 
 */
Ext.define('Ext.ux.DataView.DragSelector', {
    requires: ['Ext.dd.DragTracker', 'Ext.util.Region'],

    /**
     * Initializes the plugin by setting up the drag tracker
     */
    init: function(dataview) {
        /**
         * @property dataview
         * @type Ext.view.View
         * The DataView bound to this instance
         */
        this.dataview = dataview;
        dataview.mon(dataview, {
            beforecontainerclick: this.cancelClick,
            scope: this,
            render: {
                fn: this.onRender,
                scope: this,
                single: true
            }
        });
    },

    /**
     * @private
     * Called when the attached DataView is rendered. This sets up the DragTracker instance that will be used
     * to created a dragged selection area
     */
    onRender: function() {
        /**
         * @property tracker
         * @type Ext.dd.DragTracker
         * The DragTracker attached to this instance. Note that the 4 on* functions are called in the scope of the 
         * DragTracker ('this' refers to the DragTracker inside those functions), so we pass a reference to the 
         * DragSelector so that we can call this class's functions.
         */
        this.tracker = Ext.create('Ext.dd.DragTracker', {
            dataview: this.dataview,
            el: this.dataview.el,
            dragSelector: this,
            onBeforeStart: this.onBeforeStart,
            onStart: this.onStart,
            onDrag : this.onDrag,
            onEnd  : this.onEnd
        });

        /**
         * @property dragRegion
         * @type Ext.util.Region
         * Represents the region currently dragged out by the user. This is used to figure out which dataview nodes are
         * in the selected area and to set the size of the Proxy element used to highlight the current drag area
         */
        this.dragRegion = Ext.create('Ext.util.Region');
    },

    /**
     * @private
     * Listener attached to the DragTracker's onBeforeStart event. Returns false if the drag didn't start within the
     * DataView's el
     */
    onBeforeStart: function(e) {
        return e.target == this.dataview.getEl().dom;
    },

    /**
     * @private
     * Listener attached to the DragTracker's onStart event. Cancel's the DataView's containerclick event from firing
     * and sets the start co-ordinates of the Proxy element. Clears any existing DataView selection
     * @param {EventObject} e The click event
     */
    onStart: function(e) {
        var dragSelector = this.dragSelector,
            dataview     = this.dataview;

        // Flag which controls whether the cancelClick method vetoes the processing of the DataView's containerclick event.
        // On IE (where else), this needs to remain set for a millisecond after mouseup because even though the mouse has
        // moved, the mouseup will still trigger a click event.
        this.dragging = true;

        //here we reset and show the selection proxy element and cache the regions each item in the dataview take up
        dragSelector.fillRegions();
        dragSelector.getProxy().show();
        dataview.getSelectionModel().deselectAll();
    },

    /**
     * @private
     * Reusable handler that's used to cancel the container click event when dragging on the dataview. See onStart for
     * details
     */
    cancelClick: function() {
        return !this.tracker.dragging;
    },

    /**
     * @private
     * Listener attached to the DragTracker's onDrag event. Figures out how large the drag selection area should be and
     * updates the proxy element's size to match. Then iterates over all of the rendered items and marks them selected
     * if the drag region touches them
     * @param {EventObject} e The drag event
     */
    onDrag: function(e) {
        var dragSelector = this.dragSelector,
            selModel     = dragSelector.dataview.getSelectionModel(),
            dragRegion   = dragSelector.dragRegion,
            bodyRegion   = dragSelector.bodyRegion,
            proxy        = dragSelector.getProxy(),
            regions      = dragSelector.regions,
            length       = regions.length,

            startXY   = this.startXY,
            currentXY = this.getXY(),
            minX      = Math.min(startXY[0], currentXY[0]),
            minY      = Math.min(startXY[1], currentXY[1]),
            width     = Math.abs(startXY[0] - currentXY[0]),
            height    = Math.abs(startXY[1] - currentXY[1]),
            region, selected, i;

        Ext.apply(dragRegion, {
            top: minY,
            left: minX,
            right: minX + width,
            bottom: minY + height
        });

        dragRegion.constrainTo(bodyRegion);
        proxy.setRegion(dragRegion);

        for (i = 0; i < length; i++) {
            region = regions[i];
            selected = dragRegion.intersect(region);

            if (selected) {
                selModel.select(i, true);
            } else {
                selModel.deselect(i);
            }
        }
    },

    /**
     * @private
     * Listener attached to the DragTracker's onEnd event. This is a delayed function which executes 1
     * millisecond after it has been called. This is because the dragging flag must remain active to cancel
     * the containerclick event which the mouseup event will trigger.
     * @param {EventObject} e The event object
     */
    onEnd: Ext.Function.createDelayed(function(e) {
        var dataview = this.dataview,
            selModel = dataview.getSelectionModel(),
            dragSelector = this.dragSelector;

        this.dragging = false;
        dragSelector.getProxy().hide();
    }, 1),

    /**
     * @private
     * Creates a Proxy element that will be used to highlight the drag selection region
     * @return {Ext.Element} The Proxy element
     */
    getProxy: function() {
        if (!this.proxy) {
            this.proxy = this.dataview.getEl().createChild({
                tag: 'div',
                cls: 'x-view-selector'
            });
        }
        return this.proxy;
    },

    /**
     * @private
     * Gets the region taken up by each rendered node in the DataView. We use these regions to figure out which nodes
     * to select based on the selector region the user has dragged out
     */
    fillRegions: function() {
        var dataview = this.dataview,
            regions  = this.regions = [];

        dataview.all.each(function(node) {
            regions.push(node.getRegion());
        });
        this.bodyRegion = dataview.getEl().getRegion();
    }
});
