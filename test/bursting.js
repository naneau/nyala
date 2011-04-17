(function() {
  var Nyala, Promise, PromiseBurst, testCase;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  testCase = (require('nodeunit')).testCase;
  Nyala = require('../lib');
  Promise = Nyala.Promise;
  PromiseBurst = Nyala.PromiseBurst;
  module.exports = testCase({
    'Promises can be put into bursts and execute': function(test) {
      var chain, p1, p2, p3;
      test.expect(4);
      chain = new PromiseBurst;
      p1 = new Promise(function(keepCallback, breakCallback) {
        test.ok(true);
        return process.nextTick(keepCallback);
      });
      p2 = new Promise(function() {
        test.ok(true);
        return process.nextTick(__bind(function() {
          return this.keep();
        }, this));
      });
      p3 = new Promise(function() {
        test.ok(true);
        return process.nextTick(__bind(function() {
          return this.keep();
        }, this));
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
    'Promises can be put into bursts, and break': function(test) {
      var chain, p1, p2, p3;
      test.expect(3);
      chain = new PromiseBurst;
      p1 = new Promise(function() {
        test.ok(true);
        return process.nextTick(__bind(function() {
          return this["break"]();
        }, this));
      });
      p2 = new Promise(function(keepCallback) {
        test.ok(true);
        return process.nextTick(keepCallback);
      });
      p3 = new Promise(function(keepCallback) {
        test.ok(true);
        return process.nextTick(keepCallback);
      });
      chain.add(p1);
      chain.add(p2);
      chain.add(p3);
      chain.broken(function() {
        return test.done();
      });
      chain.kept(function() {
        return test.fail('The promise was kept');
      });
      return chain.execute();
    },
    'Promises can be put into a burst and send results to kept handlers outside of the burst': function(test) {
      var chain, p1, p2, p3;
      test.expect(7);
      chain = new PromiseBurst;
      p1 = new Promise(function() {
        test.ok(true);
        return process.nextTick(__bind(function() {
          return this.keep('foo');
        }, this));
      });
      p1.kept(function(foo) {
        return test.equal(foo, 'foo');
      });
      p2 = new Promise(function() {
        test.ok(true);
        return process.nextTick(__bind(function() {
          return this.keep('bar');
        }, this));
      });
      p2.kept(function(bar) {
        return test.equal(bar, 'bar');
      });
      p3 = new Promise(function() {
        test.ok(true);
        return process.nextTick(__bind(function() {
          return this.keep('baz');
        }, this));
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
