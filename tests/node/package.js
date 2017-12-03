const assert = require('assert');
const html2canvas = require('../../');

describe('Package', () => {
    it('should have html2canvas defined', () => {
        assert.equal(typeof html2canvas, 'function');
    });

    it('should have html2canvas defined', done => {
        html2canvas('').catch(err => {
            assert.equal(err, 'Provided element is not within a Document');
            done();
        });
    });
});
