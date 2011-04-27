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
      var args, handler, _i, _len, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _ref = this.brokenHandlers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        handler = _ref[_i];
        handler.apply(null, args);
      }
      return this;
    };
    Promise.prototype.keep = function() {
      var args, handler, _i, _len, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (this.filter) {
        args = this.filter.apply(this, args);
      }
      if (!Array.isArray(args)) {
        args = [args];
      }
      _ref = this.keptHandlers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        handler = _ref[_i];
        handler.apply(null, args);
      }
      return this;
    };
    Promise.prototype.dependOn = function(promise) {
      promise.kept(__bind(function() {
        var results;
        results = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return this.keep.apply(this, results);
      }, this));
      promise.broken(__bind(function() {
        var errors;
        errors = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return this["break"].apply(this, errors);
      }, this));
      return this;
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
    PromiseBunch.prototype.addDeferred = function() {
      var args, deferred;
      deferred = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      this.promises.push(new Promise(function() {
        var bunchArgs, deferredPromise;
        bunchArgs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        deferredPromise = deferred.apply(null, __slice.call(args).concat(__slice.call(bunchArgs)));
        deferredPromise.kept(__bind(function() {
          var keptArgs;
          keptArgs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return this.keep.apply(this, keptArgs);
        }, this));
        deferredPromise.broken(__bind(function() {
          var brokenArgs;
          brokenArgs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return this["break"].apply(this, brokenArgs);
        }, this));
        return deferredPromise.execute.apply(deferredPromise, bunchArgs);
      }));
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
    __extends(PromiseBurst, PromiseBunch);
    function PromiseBurst() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      PromiseBurst.__super__.constructor.apply(this, args);
      this.aggregatedResults = [];
    }
    PromiseBurst.prototype.eachResult = function(fn, scope) {
      var results, _i, _len, _ref, _results;
      if (scope == null) {
        scope = null;
      }
      _ref = this.aggregatedResults;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        results = _ref[_i];
        _results.push(fn.apply(scope, results));
      }
      return _results;
    };
    PromiseBurst.prototype.mapResults = function(fn, scope) {
      var mapped, results, _i, _len, _ref;
      if (scope == null) {
        scope = null;
      }
      mapped = [];
      _ref = this.aggregatedResults;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        results = _ref[_i];
        mapped.push(fn.apply(scope, results));
      }
      return mapped;
    };
    PromiseBurst.prototype.detectResults = function(fn, scope) {
      var detected, results, _i, _len, _ref;
      if (scope == null) {
        scope = null;
      }
      detected = [];
      _ref = this.aggregatedResults;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        results = _ref[_i];
        if (fn.apply(scope, results)) {
          detected.push(results);
        }
      }
      return detected;
    };
    PromiseBurst.prototype.addResults = function(start) {
      var result, _i, _len, _ref;
      _ref = this.aggregatedResults;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        result = _ref[_i];
        start += result;
      }
      return start;
    };
    PromiseBurst.prototype.runStack = function() {
      var args, breakCallback, keepCallback, keepOne, kept, promise, _i, _j, _len, _ref, _results;
      args = 3 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 2) : (_i = 0, []), keepCallback = arguments[_i++], breakCallback = arguments[_i++];
      this.aggregatedResults = [];
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
          return this.keep(this.aggregatedResults);
        }
      }, this);
      _ref = this.promises;
      _results = [];
      for (_j = 0, _len = _ref.length; _j < _len; _j++) {
        promise = _ref[_j];
        _results.push(__bind(function(promise) {
          if (!this.promiseIsSetUp(promise)) {
            promise.kept(__bind(function() {
              var keptArgs;
              keptArgs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              this.aggregatedResults.push(keptArgs);
              return keepOne(promise);
            }, this));
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
    PromiseChain.prototype.tap = function(tapFunction) {
      this.tapFunction = tapFunction;
      return this;
    };
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
          promise.kept(__bind(function() {
            var keptArgs;
            keptArgs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            if (this.tapFunction != null) {
              this.tapFunction.apply(this, keptArgs);
            }
            return next.apply(null, [index + 1].concat(__slice.call(keptArgs)));
          }, this));
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
