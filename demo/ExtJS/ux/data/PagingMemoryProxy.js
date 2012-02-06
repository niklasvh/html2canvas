/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
 * @class Ext.ux.data.PagingMemoryProxy
 * @extends Ext.data.proxy.Memory
 * <p>Paging Memory Proxy, allows to use paging grid with in memory dataset</p>
 */
Ext.define('Ext.ux.data.PagingMemoryProxy', {
    extend: 'Ext.data.proxy.Memory',
    alias: 'proxy.pagingmemory',
    alternateClassName: 'Ext.data.PagingMemoryProxy',

    read : function(operation, callback, scope){
        var reader = this.getReader(),
            result = reader.read(this.data),
            sorters, filters, sorterFn, records;

        scope = scope || this;
        // filtering
        filters = operation.filters;
        if (filters.length > 0) {
            //at this point we have an array of  Ext.util.Filter objects to filter with,
            //so here we construct a function that combines these filters by ANDing them together
            records = [];

            Ext.each(result.records, function(record) {
                var isMatch = true,
                    length = filters.length,
                    i;

                for (i = 0; i < length; i++) {
                    var filter = filters[i],
                        fn     = filter.filterFn,
                        scope  = filter.scope;

                    isMatch = isMatch && fn.call(scope, record);
                }
                if (isMatch) {
                    records.push(record);
                }
            }, this);

            result.records = records;
            result.totalRecords = result.total = records.length;
        }
        
        // sorting
        sorters = operation.sorters;
        if (sorters.length > 0) {
            //construct an amalgamated sorter function which combines all of the Sorters passed
            sorterFn = function(r1, r2) {
                var result = sorters[0].sort(r1, r2),
                    length = sorters.length,
                    i;
                
                    //if we have more than one sorter, OR any additional sorter functions together
                    for (i = 1; i < length; i++) {
                        result = result || sorters[i].sort.call(this, r1, r2);
                    }                
               
                return result;
            };
    
            result.records.sort(sorterFn);
        }
        
        // paging (use undefined cause start can also be 0 (thus false))
        if (operation.start !== undefined && operation.limit !== undefined) {
            result.records = result.records.slice(operation.start, operation.start + operation.limit);
            result.count = result.records.length;
        }

        Ext.apply(operation, {
            resultSet: result
        });
        
        operation.setCompleted();
        operation.setSuccessful();

        Ext.Function.defer(function () {
            Ext.callback(callback, scope, [operation]);
        }, 10);
    }
});

