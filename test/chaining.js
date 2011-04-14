(function() {
  var Promise, PromiseChain, testCase;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  testCase = (require('nodeunit')).testCase;
  Promise = require('../lib/promise');
  PromiseChain = require('../lib/promiseChain');
  module.exports = testCase({
    setUp: function(callback) {
      return callback();
    },
    'Promises can be chained and execute': function(test) {
      var chain;
      test.expect(4);
      chain = new PromiseChain;
      chain.add(function() {
        test.ok(true);
        return this.success();
      });
      chain.add(function() {
        test.ok(true);
        return this.success();
      });
      chain.add(function() {
        test.ok(true);
        return this.success();
      });
      chain.on('fail', function() {
        return test.fail('We should not fail');
      });
      chain.on('success', function() {
        test.ok(true);
        return test.done();
      });
      return chain.execute();
    },
    'Promises can be chained and pass params to the next item in the chain': function(test) {
      var chain;
      test.expect(4);
      chain = new PromiseChain;
      chain.add(function() {
        test.ok(true);
        return this.success('foo');
      });
      chain.add(function(foo) {
        test.equal(foo, 'foo');
        return this.success('bar');
      });
      chain.add(function(bar) {
        test.equal(bar, 'bar');
        return this.success('baz');
      });
      chain.on('fail', function() {
        return test.fail('We should not fail');
      });
      chain.on('success', function(baz) {
        test.equal(baz, 'baz');
        return test.done();
      });
      return chain.execute();
    },
    'Promises in a chain can fail and give a reason for that': function(test) {
      var chain;
      test.expect(3);
      chain = new PromiseChain;
      chain.add(function() {
        test.ok(true);
        return this.success();
      });
      chain.add(function() {
        test.ok(true);
        return this.fail('foo');
      });
      chain.add(function() {
        return test.fail('We should not get to the third step in the chain');
      });
      chain.on('fail', function(foo) {
        test.equal(foo, 'foo');
        return test.done();
      });
      chain.on('success', function() {
        return test.fail('We should not succeed');
      });
      return chain.execute();
    },
    'A PromiseChain accepts both Promise instances and bare functions': function(test) {
      var chain;
      test.expect(4);
      chain = new PromiseChain;
      chain.add(new Promise(function() {
        test.ok(true);
        return this.success();
      }));
      chain.add(function() {
        test.ok(true);
        return this.success();
      });
      chain.add(new Promise(function() {
        test.ok(true);
        return this.success();
      }));
      chain.on('fail', function() {
        return test.fail('We should not fail');
      });
      chain.on('success', function() {
        test.ok(true);
        return test.done();
      });
      return chain.execute();
    },
    'A PromiseChain accepts scoped functions': function(test) {
      var chain;
      test.expect(4);
      chain = new PromiseChain;
      chain.add(__bind(function(success, fail) {
        test.ok(true);
        return success('foo');
      }, this));
      chain.add(__bind(function(foo, success, fail) {
        test.equal(foo, 'foo');
        return success('bar');
      }, this));
      chain.add(__bind(function(bar, success, fail) {
        test.equal(bar, 'bar');
        return success();
      }, this));
      chain.on('fail', function() {
        return test.fail('We should not fail');
      });
      chain.on('success', function(foo) {
        test.ok(true);
        return test.done();
      });
      return chain.execute();
    }
  });
}).call(this);
