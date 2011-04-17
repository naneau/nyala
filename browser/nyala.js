(function() {
  var Promise, PromiseBunch, PromiseBurst, PromiseChain, moduleExport;
  var __slice = Array.prototype.slice, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  moduleExport = function(name, val) {
    if ((typeof module != "undefined" && module !== null ? module.exports : void 0) != null) {
      return module.exports[name] = val;
    } else {
      return window[name] = val;
    }
  };
  Promise = (function() {
    function Promise() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (args.length === 0) {
        throw new Error("No function passed to Promise");
      }
      this.scope = args.length >= 2 ? args[1] : this;
      this.func = args[0];
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
  moduleExport('Promise', Promise);
  PromiseBunch = (function() {
    __extends(PromiseBunch, Promise);
    function PromiseBunch() {
      var args, promise, _i, _len;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      PromiseBunch.__super__.constructor.call(this, __bind(function() {
        var executeArgs;
        executeArgs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (this.promises.length === 0) {
          return this.keep();
        }
        return this.runStack.apply(this, executeArgs);
      }, this));
      this.promises = [];
      this.setUpPromises = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        promise = args[_i];
        this.add(promise);
      }
      void 0;
    }
    PromiseBunch.prototype.add = function() {
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
    PromiseBunch.prototype.promiseIsSetUp = function(promise) {
      var checkPromise;
      return ((function() {
        var _i, _len, _ref, _results;
        _ref = this.setUpPromises;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          checkPromise = _ref[_i];
          if (checkPromise === promise) {
            _results.push(checkPromise);
          }
        }
        return _results;
      }).call(this)).length > 0;
    };
    PromiseBunch.prototype.addSetUpPromise = function(promise) {
      return this.setUpPromises.push(promise);
    };
    PromiseBunch.prototype.runStack = function() {
      var args, breakCallback, keepCallback, _i;
      args = 3 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 2) : (_i = 0, []), keepCallback = arguments[_i++], breakCallback = arguments[_i++];
    };
    return PromiseBunch;
  })();
  PromiseBurst = (function() {
    function PromiseBurst() {
      PromiseBurst.__super__.constructor.apply(this, arguments);
    }
    __extends(PromiseBurst, PromiseBunch);
    PromiseBurst.prototype.runStack = function() {
      var args, breakCallback, keepCallback, keepOne, kept, promise, _i, _j, _len, _ref, _results;
      args = 3 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 2) : (_i = 0, []), keepCallback = arguments[_i++], breakCallback = arguments[_i++];
      kept = [];
      keepOne = __bind(function(promise) {
        var checkPromise;
        if (((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = kept.length; _i < _len; _i++) {
            checkPromise = kept[_i];
            if (checkPromise === promise) {
              _results.push(checkPromise);
            }
          }
          return _results;
        })()).length > 0) {
          throw new Error("A promise was kept more than once");
        }
        kept.push(promise);
        if (kept.length === this.promises.length) {
          return this.keep();
        }
      }, this);
      _ref = this.promises;
      _results = [];
      for (_j = 0, _len = _ref.length; _j < _len; _j++) {
        promise = _ref[_j];
        _results.push(__bind(function(promise) {
          if (!this.promiseIsSetUp(promise)) {
            promise.kept(function() {
              var keptArgs;
              keptArgs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              return keepOne(promise);
            });
            promise.broken(__bind(function() {
              var brokenArgs;
              brokenArgs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              return this["break"].apply(this, brokenArgs);
            }, this));
            this.addSetUpPromise(promise);
          }
          return promise.execute.apply(promise, args);
        }, this)(promise));
      }
      return _results;
    };
    return PromiseBurst;
  })();
  moduleExport('PromiseBurst', PromiseBurst);
  PromiseChain = (function() {
    function PromiseChain() {
      PromiseChain.__super__.constructor.apply(this, arguments);
    }
    __extends(PromiseChain, PromiseBunch);
    PromiseChain.prototype.runStack = function() {
      var args, breakCallback, keepCallback, next, _i;
      args = 3 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 2) : (_i = 0, []), keepCallback = arguments[_i++], breakCallback = arguments[_i++];
      next = __bind(function() {
        var index, promise;
        index = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (!(this.promises[index] != null)) {
          return this.keep.apply(this, args);
        }
        promise = this.promises[index];
        if (!this.promiseIsSetUp(promise)) {
          promise.broken(__bind(function() {
            var brokenArgs;
            brokenArgs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return this["break"].apply(this, brokenArgs);
          }, this));
          promise.kept(function() {
            var keptArgs;
            keptArgs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return next.apply(null, [index + 1].concat(__slice.call(keptArgs)));
          });
          this.addSetUpPromise(promise);
        }
        if ((this.assertEach != null) && !this.assertEach.apply(this, args)) {
          return this["break"]("Assertion failed on step " + (index + 1));
        }
        return promise.execute.apply(promise, args);
      }, this);
      return next.apply(null, [0].concat(__slice.call(args)));
    };
    return PromiseChain;
  })();
  moduleExport('PromiseChain', PromiseChain);
}).call(this);
