(function() {
  var Promise, testCase;
  testCase = (require('nodeunit')).testCase;
  Promise = require('../lib/promise');
  module.exports = testCase({
    setUp: function(callback) {
      return callback();
    },
    'Promises accept a filter': function(test) {
      var filter, promise;
      test.expect(1);
      filter = function(foo, bar, baz) {
        return "" + foo + ":" + bar + ":" + baz;
      };
      promise = new Promise(function(foo, bar, baz) {
        return this.keep(foo, bar, baz);
      });
      promise.filter = filter;
      promise.kept(function(result) {
        test.equal(filter('foo', 'bar', 'baz'), result);
        return test.done();
      });
      return promise.execute('foo', 'bar', 'baz');
    },
    'Filters can return arrays for non-singular filtering': function(test) {
      var filter, promise;
      test.expect(3);
      filter = function(foo, bar, baz) {
        return [baz, bar, foo];
      };
      promise = new Promise(function(foo, bar, baz) {
        return this.keep(foo, bar, baz);
      });
      promise.filter = filter;
      promise.kept(function(baz, bar, foo) {
        test.equal(baz, 'baz');
        test.equal(bar, 'bar');
        test.equal(foo, 'foo');
        return test.done();
      });
      return promise.execute('foo', 'bar', 'baz');
    }
  });
}).call(this);
