/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
 * @class Ext.ux.layout.Center
 * @extends Ext.layout.container.Fit
 * <p>This is a very simple layout style used to center contents within a container.  This layout works within
 * nested containers and can also be used as expected as a Viewport layout to center the page layout.</p>
 * <p>As a subclass of FitLayout, CenterLayout expects to have a single child panel of the container that uses
 * the layout.  The layout does not require any config options, although the child panel contained within the
 * layout must provide a fixed or percentage width.  The child panel's height will fit to the container by
 * default, but you can specify <tt>autoHeight:true</tt> to allow it to autosize based on its content height.
 * Example usage:</p>
 * <pre><code>
// The content panel is centered in the container
var p = Ext.create('Ext.Panel', {
    title: 'Center Layout',
    layout: 'ux.center',
    items: [{
        title: 'Centered Content',
        widthRatio: 0.75,
        html: 'Some content'
    }]
});

// If you leave the title blank and specify no border
// you'll create a non-visual, structural panel just
// for centering the contents in the main container.
var p = Ext.create('Ext.Panel', {
    layout: 'ux.center',
    border: false,
    items: [{
        title: 'Centered Content',
        width: 300,
        autoHeight: true,
        html: 'Some content'
    }]
});
</code></pre>
 */
Ext.define('Ext.ux.layout.Center', {
    extend: 'Ext.layout.container.Fit',
    alias: 'layout.ux.center',
    // private
    setItemSize : function(item, width, height) {
        this.owner.addCls('ux-layout-center');
        item.addCls('ux-layout-center-item');
        if (height > 0) {
            if (width) {
                width = item.width;
                if (Ext.isNumber(item.widthRatio)) {
                    width = Math.round(this.owner.el.getWidth() * item.widthRatio);
                }
            }
            item.setSize(width, height);
            item.margins.left = Math.round((this.owner.el.getWidth() - width) * 0.5);
        }

    }
});

