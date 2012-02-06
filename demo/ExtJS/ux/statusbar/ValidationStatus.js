/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
 * @class Ext.ux.statusbar.ValidationStatus
 * A {@link Ext.StatusBar} plugin that provides automatic error notification when the
 * associated form contains validation errors.
 * @extends Ext.Component
 * @constructor
 * Creates a new ValiationStatus plugin
 * @param {Object} config A config object
 */
Ext.define('Ext.ux.statusbar.ValidationStatus', {
    extend: 'Ext.Component', 
    requires: ['Ext.util.MixedCollection'],
    /**
     * @cfg {String} errorIconCls
     * The {@link #iconCls} value to be applied to the status message when there is a
     * validation error. Defaults to <tt>'x-status-error'</tt>.
     */
    errorIconCls : 'x-status-error',
    /**
     * @cfg {String} errorListCls
     * The css class to be used for the error list when there are validation errors.
     * Defaults to <tt>'x-status-error-list'</tt>.
     */
    errorListCls : 'x-status-error-list',
    /**
     * @cfg {String} validIconCls
     * The {@link #iconCls} value to be applied to the status message when the form
     * validates. Defaults to <tt>'x-status-valid'</tt>.
     */
    validIconCls : 'x-status-valid',
    
    /**
     * @cfg {String} showText
     * The {@link #text} value to be applied when there is a form validation error.
     * Defaults to <tt>'The form has errors (click for details...)'</tt>.
     */
    showText : 'The form has errors (click for details...)',
    /**
     * @cfg {String} showText
     * The {@link #text} value to display when the error list is displayed.
     * Defaults to <tt>'Click again to hide the error list'</tt>.
     */
    hideText : 'Click again to hide the error list',
    /**
     * @cfg {String} submitText
     * The {@link #text} value to be applied when the form is being submitted.
     * Defaults to <tt>'Saving...'</tt>.
     */
    submitText : 'Saving...',
    
    // private
    init : function(sb){
        sb.on('render', function(){
            this.statusBar = sb;
            this.monitor = true;
            this.errors = Ext.create('Ext.util.MixedCollection');
            this.listAlign = (sb.statusAlign === 'right' ? 'br-tr?' : 'bl-tl?');
            
            if (this.form) {
                this.formPanel = Ext.getCmp(this.form);
                this.basicForm = this.formPanel.getForm();
                this.startMonitoring();
                this.basicForm.on('beforeaction', function(f, action){
                    if(action.type === 'submit'){
                        // Ignore monitoring while submitting otherwise the field validation
                        // events cause the status message to reset too early
                        this.monitor = false;
                    }
                }, this);
                var startMonitor = function(){
                    this.monitor = true;
                };
                this.basicForm.on('actioncomplete', startMonitor, this);
                this.basicForm.on('actionfailed', startMonitor, this);
            }
        }, this, {single:true});
        sb.on({
            scope: this,
            afterlayout:{
                single: true,
                fn: function(){
                    // Grab the statusEl after the first layout.
                    sb.statusEl.getEl().on('click', this.onStatusClick, this, {buffer:200});
                } 
            }, 
            beforedestroy:{
                single: true,
                fn: this.onDestroy
            } 
        });
    },
    
    // private
    startMonitoring : function() {
        this.basicForm.getFields().each(function(f){
            f.on('validitychange', this.onFieldValidation, this);
        }, this);
    },
    
    // private
    stopMonitoring : function(){
        this.basicForm.getFields().each(function(f){
            f.un('validitychange', this.onFieldValidation, this);
        }, this);
    },
    
    // private
    onDestroy : function(){
        this.stopMonitoring();
        this.statusBar.statusEl.un('click', this.onStatusClick, this);
        this.callParent(arguments);
    },
    
    // private
    onFieldValidation : function(f, isValid){
        if (!this.monitor) {
            return false;
        }
        var msg = f.getErrors()[0];
        if (msg) {
            this.errors.add(f.id, {field:f, msg:msg});
        } else {
            this.errors.removeAtKey(f.id);
        }
        this.updateErrorList();
        if(this.errors.getCount() > 0) {
            if(this.statusBar.getText() !== this.showText){
                this.statusBar.setStatus({text:this.showText, iconCls:this.errorIconCls});
            }
        }else{
            this.statusBar.clearStatus().setIcon(this.validIconCls);
        }
    },
    
    // private
    updateErrorList : function(){
        if(this.errors.getCount() > 0){
         var msg = '<ul>';
         this.errors.each(function(err){
             msg += ('<li id="x-err-'+ err.field.id +'"><a href="#">' + err.msg + '</a></li>');
         }, this);
         this.getMsgEl().update(msg+'</ul>');
        }else{
            this.getMsgEl().update('');
        }
        // reset msgEl size
        this.getMsgEl().setSize('auto', 'auto');
    },
    
    // private
    getMsgEl : function(){
        if(!this.msgEl){
            this.msgEl = Ext.DomHelper.append(Ext.getBody(), {
                cls: this.errorListCls
            }, true);
            this.msgEl.hide();
            this.msgEl.on('click', function(e){
                var t = e.getTarget('li', 10, true);
                if(t){
                    Ext.getCmp(t.id.split('x-err-')[1]).focus();
                    this.hideErrors();
                }
            }, this, {stopEvent:true}); // prevent anchor click navigation
        }
        return this.msgEl;
    },
    
    // private
    showErrors : function(){
        this.updateErrorList();
        this.getMsgEl().alignTo(this.statusBar.getEl(), this.listAlign).slideIn('b', {duration: 300, easing:'easeOut'});
        this.statusBar.setText(this.hideText);
        this.formPanel.el.on('click', this.hideErrors, this, {single:true}); // hide if the user clicks directly into the form
    },
    
    // private
    hideErrors : function(){
        var el = this.getMsgEl();
        if(el.isVisible()){
         el.slideOut('b', {duration: 300, easing:'easeIn'});
         this.statusBar.setText(this.showText);
        }
        this.formPanel.el.un('click', this.hideErrors, this);
    },
    
    // private
    onStatusClick : function(){
        if(this.getMsgEl().isVisible()){
            this.hideErrors();
        }else if(this.errors.getCount() > 0){
            this.showErrors();
        }
    }
});
