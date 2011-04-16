(function() {
  var Promise, PromiseChain;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __slice = Array.prototype.slice, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Promise = require('./promise');
  PromiseChain = (function() {
    __extends(PromiseChain, Promise);
    function PromiseChain() {
      var args, promise, _i, _len;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      PromiseChain.__super__.constructor.call(this, __bind(function() {
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return this.runStack.apply(this, args);
      }, this));
      this.promises = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        promise = args[_i];
        this.add(promise);
      }
      this;
    }
    PromiseChain.prototype.add = function() {
      var args, promise;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (typeof args[0] === 'function') {
        promise = (function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args);
          return typeof result == "object" ? result : child;
        })(Promise, args, function() {});
      } else {
        promise = args[0];
      }
      this.promises.push(promise);
      return this;
    };
    PromiseChain.prototype.runStack = function() {
      var args, breakCallback, keepCallback, next, stack, _i;
      args = 3 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 2) : (_i = 0, []), keepCallback = arguments[_i++], breakCallback = arguments[_i++];
      stack = this.promises;
      if (stack.length === 0) {
        return;
      }
      next = __bind(function() {
        var failed, index, promise;
        index = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (!(stack[index] != null)) {
          return this.keep.apply(this, args);
        }
        promise = stack[index];
        failed = false;
        promise.broken(__bind(function() {
          var brokenArgs;
          brokenArgs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          failed = true;
          return this["break"].apply(this, brokenArgs);
        }, this));
        promise.kept(function() {
          var keptArgs;
          keptArgs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          if (!failed) {
            return next.apply(null, [index + 1].concat(__slice.call(keptArgs)));
          }
        });
        if ((this.assertEach != null) && !this.assertEach.apply(this, args)) {
          return this["break"]("Assertion failed on step " + (index + 1));
        }
        return promise.execute.apply(promise, args);
      }, this);
      return next.apply(null, [0].concat(__slice.call(args)));
    };
    return PromiseChain;
  })();
  module.exports = PromiseChain;
}).call(this);
