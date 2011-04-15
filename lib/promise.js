(function() {
  var Promise;
  var __slice = Array.prototype.slice, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Promise = (function() {
    function Promise() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.func = args.pop();
      this.scope = args.length > 0 ? args.pop() : this;
      this.brokenHandlers = [];
      this.keptHandlers = [];
      void 0;
    }
    Promise.prototype.kept = function(handler) {
      this.keptHandlers.push(handler);
      return this;
    };
    Promise.prototype.broken = function(handler) {
      this.brokenHandlers.push(handler);
      return this;
    };
    Promise.prototype.execute = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if ((this.assert != null) && !this.assert.apply(this, args)) {
        return this["break"]('Assertion failed');
      }
      args.push(__bind(function() {
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return this.keep.apply(this, args);
      }, this));
      args.push(__bind(function() {
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return this["break"].apply(this, args);
      }, this));
      return this.func.apply(this.scope, args);
    };
    Promise.prototype["break"] = function() {
      var args, handler, _i, _len, _ref, _results;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _ref = this.brokenHandlers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        handler = _ref[_i];
        _results.push(handler.apply(null, args));
      }
      return _results;
    };
    Promise.prototype.keep = function() {
      var args, handler, _i, _len, _ref, _results;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (this.filter) {
        args = this.filter.apply(this, args);
      }
      if (!Array.isArray(args)) {
        args = [args];
      }
      _ref = this.keptHandlers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        handler = _ref[_i];
        _results.push(handler.apply(null, args));
      }
      return _results;
    };
    return Promise;
  })();
  module.exports = Promise;
}).call(this);
