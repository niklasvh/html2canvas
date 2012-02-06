/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
* @class Ext.ux.ProgressBarPager
* @extends Object
* Plugin for displaying a progressbar inside of a paging toolbar instead of plain text
* @constructor
* Create a new ItemSelector
* @param {Object} config Configuration options
*/
Ext.define('Ext.ux.ProgressBarPager', {
    extend: 'Object',

    requires: ['Ext.ProgressBar'],
    /**
     * @cfg {Integer} width
     * <p>The default progress bar width.  Default is 225.</p>
    */
    width   : 225,
    /**
     * @cfg {String} defaultText
    * <p>The text to display while the store is loading.  Default is 'Loading...'</p>
     */
    defaultText    : 'Loading...',
    /**
     * @cfg {Object} defaultAnimCfg
     * <p>A {@link Ext.fx.Anim Ext.fx.Anim} configuration object.</p>
     */
    defaultAnimCfg : {
		duration: 1000,
		easing: 'bounceOut'	
	},	
    
    constructor : function(config) {
        if (config) {
            Ext.apply(this, config);
        }
    },
    //public
    init : function (parent) {
        var displayItem;
        if(parent.displayInfo) {
            this.parent = parent;

            displayItem = parent.child("#displayItem");
            if (displayItem) {
                parent.remove(displayItem, true);
            }

            this.progressBar = Ext.create('Ext.ProgressBar', {
                text    : this.defaultText,
                width   : this.width,
                animate : this.defaultAnimCfg
            });

            parent.displayItem = this.progressBar;

            parent.add(parent.displayItem);
            parent.doLayout();
            Ext.apply(parent, this.parentOverrides);

            this.progressBar.on('render', function(pb) {
                pb.mon(pb.getEl().applyStyles('cursor:pointer'), 'click', this.handleProgressBarClick, this);
            }, this, {single: true});
        }
    },
    // private
    // This method handles the click for the progress bar
    handleProgressBarClick : function(e){
        var parent = this.parent,
            displayItem = parent.displayItem,
            box = this.progressBar.getBox(),
            xy = e.getXY(),
            position = xy[0]- box.x,
            pages = Math.ceil(parent.store.getTotalCount()/parent.pageSize),
            newpage = Math.ceil(position/(displayItem.width/pages));

        parent.store.loadPage(newpage);
    },

    // private, overriddes
    parentOverrides  : {
        // private
        // This method updates the information via the progress bar.
        updateInfo : function(){
            if(this.displayItem){
                var count = this.store.getCount(),
                    pageData = this.getPageData(),
                    message = count === 0 ?
                    this.emptyMsg :
                    Ext.String.format(
                        this.displayMsg,
                        pageData.fromRecord, pageData.toRecord, this.store.getTotalCount()
                    ),
                    percentage = pageData.pageCount > 0 ? (pageData.currentPage / pageData.pageCount) : 0;

                this.displayItem.updateProgress(percentage, message, this.animate || this.defaultAnimConfig);
            }
        }
    }
});


