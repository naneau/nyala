(function() {
  var Promise, PromiseChain, events;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __slice = Array.prototype.slice;
  events = require('events');
  Promise = (function() {
    __extends(Promise, events.EventEmitter);
    function Promise(func) {
      this.func = func;
    }
    Promise.prototype.fail = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.emit.apply(this, ['fail'].concat(__slice.call(args)));
    };
    Promise.prototype.success = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (this.filter) {
        args = this.filter.apply(this, args);
      }
      if (!Array.isArray(args)) {
        args = [args];
      }
      return this.emit.apply(this, ['success'].concat(__slice.call(args)));
    };
    Promise.prototype.execute = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if ((this.assert != null) && !this.assert.apply(this, args)) {
        return this.fail('Assertion failed');
      }
      return this.func.apply(this, args);
    };
    return Promise;
  })();
  PromiseChain = (function() {
    __extends(PromiseChain, Promise);
    function PromiseChain() {
      var args, promise, t, _i, _len;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      t = this;
      PromiseChain.__super__.constructor.call(this, function() {
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return t.runStack.apply(t, args);
      });
      this.promises = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        promise = args[_i];
        this.add(promise);
      }
      this;
    }
    PromiseChain.prototype.add = function(promise) {
      if (typeof promise === 'function') {
        promise = new Promise(promise);
      }
      this.promises.push(promise);
      return this;
    };
    PromiseChain.prototype.runStack = function() {
      var args, next, stack;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      stack = this.promises;
      if (stack.length === 0) {
        return;
      }
      next = function() {
        var failed, index, promise;
        index = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (!(stack[index] != null)) {
          return;
        }
        promise = stack[index];
        failed = false;
        promise.on('fail', function() {
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          failed = true;
          return this.fail.apply(this, args);
        });
        promise.on('success', function() {
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          if (!failed) {
            return next.apply(null, [index + 1].concat(__slice.call(args)));
          }
        });
        if ((this.assertEach != null) && !this.assertEach.apply(this, args)) {
          return this.fail("Assertion failed on step " + (index + 1));
        }
        return promise.execute.apply(promise, args);
      };
      return next.apply(null, [0].concat(__slice.call(args)));
    };
    return PromiseChain;
  })();
  module.exports = {
    Promise: Promise,
    PromiseChain: PromiseChain
  };
}).call(this);
