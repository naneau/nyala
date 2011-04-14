(function() {
  var Promise, events;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __slice = Array.prototype.slice, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  events = require('events');
  Promise = (function() {
    __extends(Promise, events.EventEmitter);
    function Promise(func) {
      this.func = func;
      void 0;
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
      var args, fail, success;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if ((this.assert != null) && !this.assert.apply(this, args)) {
        return this.fail('Assertion failed');
      }
      success = __bind(function() {
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return this.success.apply(this, args);
      }, this);
      fail = __bind(function() {
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return this.fail.apply(this, args);
      }, this);
      return this.func.apply(this, __slice.call(args).concat([success], [fail]));
    };
    return Promise;
  })();
  module.exports = Promise;
}).call(this);
