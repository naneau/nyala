(function() {
  var Promise, testCase;
  testCase = (require('nodeunit')).testCase;
  Promise = require('../lib/promise');
  module.exports = testCase({
    setUp: function(callback) {
      return callback();
    },
    'Promises accept an assert that succeeds': function(test) {
      var promise;
      test.expect(1);
      promise = new Promise(function(foo, bar, baz) {
        return this.success(foo, bar, baz);
      });
      promise.assert = function(foo, bar, baz) {
        return foo === 'foo';
      };
      promise.kept(function(foo, bar, baz) {
        test.equal(foo, 'foo');
        return test.done();
      });
      promise.broken(function(result) {
        return test.fail('We should not fail');
      });
      return promise.execute('foo', 'bar', 'baz');
    },
    'Promises accept an assert that fails': function(test) {
      var promise;
      test.expect(0);
      promise = new Promise(function(foo, bar, baz) {
        return this.success(foo, bar, baz);
      });
      promise.assert = function(foo, bar, baz) {
        return foo === 'quux';
      };
      promise.kept(function(result) {
        return test.fail('We should not succeed if the assertion fails');
      });
      promise.broken(function(result) {
        return test.done();
      });
      return promise.execute('foo', 'bar', 'baz');
    }
  });
}).call(this);
