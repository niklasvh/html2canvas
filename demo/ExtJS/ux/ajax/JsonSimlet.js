/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
 * @class Ext.ux.ajax.JsonSimlet
 */
Ext.define('Ext.ux.ajax.JsonSimlet', function () {

    function makeSortFn (def, cmp) {
        var order = def.direction,
            sign = (order && order.toUpperCase() == 'DESC') ? -1 : 1;

        return function (leftRec, rightRec) {
            var lhs = leftRec[def.property],
                rhs = rightRec[def.property],
                c = (lhs < rhs) ? -1 : ((rhs < lhs) ? 1 : 0);

            if (c || !cmp) {
                return c * sign;
            }

            return cmp(leftRec, rightRec);
        }
    }

    function makeSortFns (defs, cmp) {
        for (var sortFn = cmp, i = defs && defs.length; i; ) {
            sortFn = makeSortFn(defs[--i], sortFn);
        }
        return sortFn;
    }

    return {
        extend: 'Ext.ux.ajax.Simlet',
        alias: 'simlet.json',

        getData: function (ctx) {
            var me = this,
                data = me.data,
                params = ctx.params,
                order = (params.group || '') + (params.sort || ''),
                fields,
                sortFn,
                i;

            if (!order) {
                return data;
            }

            if (order == me.currentOrder) {
                return me.sortedData;
            }

            ctx.sortSpec = fields = params.sort && Ext.decode(params.sort);
            sortFn = makeSortFns(fields);

            ctx.groupSpec = fields = params.group && Ext.decode(params.group);
            sortFn = makeSortFns(fields, sortFn);

            data = data.slice(0); // preserve 'physical' order of raw data...
            data.sort(sortFn);

            me.sortedData = data;
            me.currentOrder = order;

            return data;
        },

        getPage: function (ctx, data) {
            var ret = data,
                length = data.length,
                start = ctx.params.start || 0,
                end = ctx.params.limit ? Math.min(length, start + ctx.params.limit) : length;

            if (start || end < length) {
                ret = ret.slice(start, end);
            }

            return ret;
        },

        getGroupSummary: function (groupField, rows, ctx) {
            return rows[0];
        },

        getSummary: function (ctx, data, page) {
            var me = this,
                groupField = ctx.groupSpec[0].property,
                accum,
                todo = {},
                summary = [],
                fieldValue,
                lastFieldValue;

            Ext.each(page, function (rec) {
                fieldValue = rec[groupField];
                todo[fieldValue] = true;
            });

            function flush () {
                if (accum) {
                    summary.push(me.getGroupSummary(groupField, accum, ctx));
                    accum = null;
                }
            }

            // data is ordered primarily by the groupField, so one pass can pick up all
            // the summaries one at a time.
            Ext.each(data, function (rec) {
                fieldValue = rec[groupField];

                if (lastFieldValue !== fieldValue) {
                    flush();
                    lastFieldValue = fieldValue;
                }

                if (!todo[fieldValue]) {
                    // if we have even 1 summary, we have summarized all that we need
                    // (again because data and page are ordered by groupField)
                    return !summary.length;
                }

                if (accum) {
                    accum.push(rec);
                } else {
                    accum = [rec];
                }

                return true;
            });

            flush(); // make sure that last pesky summary goes...

            return summary;
        },

        doGet: function (ctx) {
            var me = this,
                data = me.getData(ctx),
                page = me.getPage(ctx, data),
                response = {
                    data: page,
                    totalRecords: data.length
                },
                ret = this.callParent(arguments); // pick up status/statusText

            if (ctx.groupSpec) {
                response.summaryData = me.getSummary(ctx, data, page);
            }

            ret.responseText = Ext.encode(response);
            return ret;
        }
    };
}());

