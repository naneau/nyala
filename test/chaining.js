(function() {
  var Nyala, Promise, PromiseChain, testCase;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  testCase = (require('nodeunit')).testCase;
  Nyala = require('../lib');
  Promise = Nyala.Promise;
  PromiseChain = Nyala.PromiseChain;
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
        return this.keep();
      });
      chain.add(function() {
        test.ok(true);
        return this.keep();
      });
      chain.add(function() {
        test.ok(true);
        return this.keep();
      });
      chain.broken(function() {
        return test.fail('We should not fail');
      });
      chain.kept(function() {
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
        return this.keep('foo');
      });
      chain.add(function(foo) {
        test.equal(foo, 'foo');
        return this.keep('bar');
      });
      chain.add(function(bar) {
        test.equal(bar, 'bar');
        return this.keep('baz');
      });
      chain.broken(function() {
        return test.fail('We should not fail');
      });
      chain.kept(function(baz) {
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
        return this.keep();
      });
      chain.add(function() {
        test.ok(true);
        return this["break"]('foo');
      });
      chain.add(function() {
        return test.fail('We should not get to the third step in the chain');
      });
      chain.broken(function(foo) {
        test.equal(foo, 'foo');
        return test.done();
      });
      chain.kept(function() {
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
        return this.keep();
      }));
      chain.add(function() {
        test.ok(true);
        return this.keep();
      });
      chain.add(new Promise(function() {
        test.ok(true);
        return this.keep();
      }));
      chain.broken(function() {
        return test.fail('We should not fail');
      });
      chain.kept(function() {
        test.ok(true);
        return test.done();
      });
      return chain.execute();
    },
    'A PromiseChain accepts scoped functions': function(test) {
      var chain;
      test.expect(5);
      chain = new PromiseChain;
      this.foo = 'foo';
      chain.add(__bind(function(success, fail) {
        test.equal(this.foo, 'foo');
        test.ok(true);
        return success('foo');
      }, this));
      chain.add(function(foo, success, fail) {
        test.equal(foo, 'foo');
        return success('bar');
      });
      chain.add(function(bar, success, fail) {
        test.equal(bar, 'bar');
        return success();
      });
      chain.broken(function() {
        return test.fail('We should not fail');
      });
      chain.kept(function(foo) {
        test.ok(true);
        return test.done();
      });
      return chain.execute();
    },
    'A PromiseChain can be tapped': function(test) {
      var chain;
      test.expect(3);
      chain = new PromiseChain;
      chain.tap(function(foo) {
        return test.equal(foo, 'foo');
      });
      chain.add(function() {
        return process.nextTick(__bind(function() {
          return this.keep('foo');
        }, this));
      });
      chain.add(function() {
        return process.nextTick(__bind(function() {
          return this.keep('foo');
        }, this));
      });
      chain.add(function() {
        return process.nextTick(__bind(function() {
          return this.keep('foo');
        }, this));
      });
      chain.broken(function() {
        return test.fail('We should not fail');
      });
      chain.kept(function(foo) {
        return test.done();
      });
      return chain.execute();
    }
  });
}).call(this);
