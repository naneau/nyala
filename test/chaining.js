(function() {
  var Promise, PromiseChain, testCase;
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
    }
  });
}).call(this);
