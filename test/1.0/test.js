const sample = require('../../example/1.0/sample.json');
const expected = require('./expected.json');

describe('v1.0', function() {
  it('should expand correctly', function(done) {
    jsonld.expand(sample, function(err, expanded) {
      expect(expanded).to.eql(expected);
      done();
    });
  });
});