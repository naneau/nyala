(function() {
  var Promise, testCase;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  testCase = (require('nodeunit')).testCase;
  Promise = require('../lib/promise');
  module.exports = testCase({
    setUp: function(callback) {
      return callback();
    },
    'Promises execute': function(test) {
      var promise;
      test.expect(0);
      promise = new Promise(function() {
        return test.done();
      });
      return promise.execute();
    },
    'Promises get parameters passed to the function': function(test) {
      var promise;
      test.expect(3);
      promise = new Promise(function(foo, bar, baz) {
        test.equal(foo, 'foo');
        test.equal(bar, 'bar');
        test.equal(baz, 'baz');
        return test.done();
      });
      return promise.execute('foo', 'bar', 'baz');
    },
    'Promises can record success': function(test) {
      var promise;
      test.expect(0);
      promise = new Promise(function() {
        var fn;
        fn = __bind(function() {
          return this.success();
        }, this);
        return process.nextTick(fn);
      });
      promise.on('fail', function() {
        return test.fail('Should not fail');
      });
      promise.on('success', function() {
        return test.done();
      });
      return promise.execute();
    },
    'Promises can record failure': function(test) {
      var promise;
      test.expect(0);
      promise = new Promise(function() {
        var fn;
        fn = __bind(function() {
          return this.fail();
        }, this);
        return process.nextTick(fn);
      });
      promise.on('success', function() {
        return test.fail('Should not succeed');
      });
      promise.on('fail', function() {
        return test.done();
      });
      return promise.execute();
    },
    'Promises can record success and pass results': function(test) {
      var promise;
      test.expect(3);
      promise = new Promise(function() {
        var fn;
        fn = __bind(function() {
          return this.success('foo', 'bar', 'baz');
        }, this);
        return process.nextTick(fn);
      });
      promise.on('fail', function() {
        return test.fail('Should not fail');
      });
      promise.on('success', function(foo, bar, baz) {
        test.equal(foo, 'foo');
        test.equal(bar, 'bar');
        test.equal(baz, 'baz');
        return test.done();
      });
      return promise.execute();
    },
    'Promises can record failure and pass results': function(test) {
      var promise;
      test.expect(3);
      promise = new Promise(function() {
        var fn;
        fn = __bind(function() {
          return this.fail('foo', 'bar', 'baz');
        }, this);
        return process.nextTick(fn);
      });
      promise.on('success', function() {
        return test.fail('Should not succeed');
      });
      promise.on('fail', function(foo, bar, baz) {
        test.equal(foo, 'foo');
        test.equal(bar, 'bar');
        test.equal(baz, 'baz');
        return test.done();
      });
      return promise.execute();
    },
    'Promises can execute with a different scope and still succeed': function(test) {
      var promise;
      test.expect(6);
      promise = new Promise(__bind(function(foo, bar, baz, success, fail) {
        test.equal(foo, 'foo');
        test.equal(bar, 'bar');
        test.equal(baz, 'baz');
        return success(foo, bar, baz);
      }, this));
      promise.on('fail', function() {
        return test.fail('Should not fail');
      });
      promise.on('success', function(foo, bar, baz) {
        test.equal(foo, 'foo');
        test.equal(bar, 'bar');
        test.equal(baz, 'baz');
        return test.done();
      });
      return promise.execute('foo', 'bar', 'baz');
    },
    'Promises can execute with a different scope and still fail': function(test) {
      var promise;
      test.expect(6);
      promise = new Promise(__bind(function(foo, bar, baz, success, fail) {
        test.equal(foo, 'foo');
        test.equal(bar, 'bar');
        test.equal(baz, 'baz');
        return fail(foo, bar, baz);
      }, this));
      promise.on('success', function() {
        return test.fail('Should not succeed');
      });
      promise.on('fail', function(foo, bar, baz) {
        test.equal(foo, 'foo');
        test.equal(bar, 'bar');
        test.equal(baz, 'baz');
        return test.done();
      });
      return promise.execute('foo', 'bar', 'baz');
    }
  });
}).call(this);
