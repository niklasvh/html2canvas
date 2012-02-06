/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
 * @private
 * @class Ext.ux.layout.component.form.MultiSelect
 * @extends Ext.layout.component.field.Field
 * Layout class for {@link Ext.ux.form.MultiSelect} fields.
 * @private
 */
Ext.define('Ext.ux.layout.component.form.MultiSelect', {
    extend: 'Ext.layout.component.field.Field',
    alias: ['layout.multiselectfield'],

    type: 'multiselectfield',

    /**
     * @cfg {Number} height The height of the field. Defaults to 200.
     */
    defaultHeight: 200,

    sizeBodyContents: function(width, height) {
        var me = this;

        if (!Ext.isNumber(height)) {
            height = me.defaultHeight;
        }

        me.owner.panel.setSize(width, height);
    }
});
