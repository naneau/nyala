(function() {
  var Nyala, Promise, PromiseChain, testCase;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  testCase = (require('nodeunit')).testCase;
  Nyala = require('../lib');
  Promise = Nyala.Promise;
  PromiseChain = Nyala.PromiseChain;
  module.exports = testCase({
    'Promises can be put into a bursts and execute': function(test) {
      var chain, p1, p2, p3;
      test.expect(4);
      chain = new PromiseChain;
      p1 = new Promise(function() {
        test.ok(true);
        return this.keep();
      });
      p2 = new Promise(function() {
        test.ok(true);
        return this.keep();
      });
      p3 = new Promise(function() {
        test.ok(true);
        return this.keep();
      });
      chain.add(p1);
      chain.add(p2);
      chain.add(p3);
      chain.broken(function() {
        return test.fail('We should not fail');
      });
      chain.kept(function() {
        test.ok(true);
        return test.done();
      });
      return chain.execute();
    },
    'Promises can be put into a bursts and send results to kept handlers': function(test) {
      var chain, p1, p2, p3;
      test.expect(7);
      chain = new PromiseChain;
      p1 = new Promise(function() {
        test.ok(true);
        return this.keep('foo');
      });
      p1.kept(function(foo) {
        return test.equal(foo, 'foo');
      });
      p2 = new Promise(function() {
        test.ok(true);
        return this.keep('bar');
      });
      p2.kept(function(bar) {
        return test.equal(bar, 'bar');
      });
      p3 = new Promise(function() {
        var fn;
        test.ok(true);
        fn = __bind(function() {
          return this.keep('baz');
        }, this);
        return process.nextTick(fn);
      });
      p3.kept(function(baz) {
        return test.equal(baz, 'baz');
      });
      chain.add(p1);
      chain.add(p2);
      chain.add(p3);
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
