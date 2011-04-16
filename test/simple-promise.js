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
    'Promises throw an exception if they do not get passed a function to execute': function(test) {
      test.expect(1);
      test.throws(function() {
        var promise;
        return promise = new Promise;
      });
      return test.done();
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
          return this.keep();
        }, this);
        return process.nextTick(fn);
      });
      promise.broken(function() {
        return test.fail('Should not fail');
      });
      promise.kept(function() {
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
          return this["break"]();
        }, this);
        return process.nextTick(fn);
      });
      promise.kept(function() {
        return test.fail('Should not succeed');
      });
      promise.broken(function() {
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
          return this.keep('foo', 'bar', 'baz');
        }, this);
        return process.nextTick(fn);
      });
      promise.broken(function() {
        return test.fail('Should not fail');
      });
      promise.kept(function(foo, bar, baz) {
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
          return this["break"]('foo', 'bar', 'baz');
        }, this);
        return process.nextTick(fn);
      });
      promise.kept(function() {
        return test.fail('Should not succeed');
      });
      promise.broken(function(foo, bar, baz) {
        test.equal(foo, 'foo');
        test.equal(bar, 'bar');
        test.equal(baz, 'baz');
        return test.done();
      });
      return promise.execute();
    },
    'Promises can execute with a different scope and still succeed': function(test) {
      var promise, scope;
      test.expect(7);
      scope = {
        foo: 'foo'
      };
      promise = new Promise(function(foo, bar, baz, keepCallback, breakCallback) {
        test.equal(this.foo, 'foo');
        test.equal(foo, 'foo');
        test.equal(bar, 'bar');
        test.equal(baz, 'baz');
        return keepCallback(foo, bar, baz);
      });
      promise.scope = scope;
      promise.broken(function() {
        return test.fail('Should not fail');
      });
      promise.kept(function(foo, bar, baz) {
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
      promise = new Promise(__bind(function(foo, bar, baz, keepCallback, breakCallback) {
        test.equal(foo, 'foo');
        test.equal(bar, 'bar');
        test.equal(baz, 'baz');
        return breakCallback(foo, bar, baz);
      }, this));
      promise.kept(function() {
        return test.fail('Should not succeed');
      });
      promise.broken(function(foo, bar, baz) {
        test.equal(foo, 'foo');
        test.equal(bar, 'bar');
        test.equal(baz, 'baz');
        return test.done();
      });
      return promise.execute('foo', 'bar', 'baz');
    }
  });
}).call(this);
