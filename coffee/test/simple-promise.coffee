# Unit Test for a single promise

# Nodeunit's test case
testCase = (require 'nodeunit').testCase

{Promise} = require '../lib'

# Test case promise
module.exports = testCase 

    setUp: (callback) ->
        do callback
        
    'Promises execute': (test) ->
        test.expect 0
        
        promise = new Promise () -> do test.done
        do promise.execute
    
    'Promises throw an exception if they do not get passed a function to execute': (test) ->
        test.expect 1
        test.throws () -> promise = new Promise
        do test.done
        
    'Promises get parameters passed to the function': (test) ->
        test.expect 3

        promise = new Promise (foo, bar, baz) -> 
            test.equal foo, 'foo'
            test.equal bar, 'bar'
            test.equal baz, 'baz'
            
            do test.done

        promise.execute 'foo', 'bar', 'baz'
    
    'Promises can record success': (test) ->
        test.expect 0
        
        # @keep is asynchronous
        promise = new Promise () -> 
            fn = () => do @keep
            process.nextTick fn
            
        promise.broken () -> test.fail 'Should not fail'
        promise.kept () -> do test.done    

        do promise.execute
    
    'Promises can record failure': (test) ->
        test.expect 0

        # @keep is asynchronous
        promise = new Promise () -> 
            fn = () => do @break
            process.nextTick fn
            
        promise.kept () -> test.fail 'Should not succeed'
        promise.broken () -> do test.done    

        do promise.execute
    
    'Promises can record success and pass results': (test) ->
        test.expect 3

        # @keep is asynchronous
        promise = new Promise () -> 
            fn = () => @keep 'foo', 'bar', 'baz'
            process.nextTick fn
            
        promise.broken () -> test.fail 'Should not fail'
        promise.kept (foo, bar, baz) -> 
            test.equal foo, 'foo'
            test.equal bar, 'bar'
            test.equal baz, 'baz'
        
            do test.done    

        do promise.execute

    'Promises can record failure and pass results': (test) ->
        test.expect 3

        # @keep is asynchronous
        promise = new Promise () -> 
            fn = () => @break 'foo', 'bar', 'baz'
            process.nextTick fn
            
        promise.kept () -> test.fail 'Should not succeed'
        promise.broken (foo, bar, baz) -> 
            test.equal foo, 'foo'
            test.equal bar, 'bar'
            test.equal baz, 'baz'

            do test.done    

        do promise.execute
        
    'Promises can execute with a different scope and still succeed': (test) ->
        test.expect 7
        
        scope = foo: 'foo'
        
        promise = new Promise (foo, bar, baz, keepCallback, breakCallback) -> 
            # this.foo should be available
            test.equal @foo, 'foo'
            
            test.equal foo, 'foo'
            test.equal bar, 'bar'
            test.equal baz, 'baz'
            
            keepCallback foo, bar, baz
        
        # Set the scope
        promise.scope = scope
        
        promise.broken () -> test.fail 'Should not fail'
        promise.kept (foo, bar, baz) ->
        
            test.equal foo, 'foo'
            test.equal bar, 'bar'
            test.equal baz, 'baz'
        
            do test.done
    
        promise.execute 'foo', 'bar', 'baz'

    'Promises can execute with a different scope and still fail': (test) ->
        test.expect 6

        promise = new Promise (foo, bar, baz, keepCallback, breakCallback) => 
            test.equal foo, 'foo'
            test.equal bar, 'bar'
            test.equal baz, 'baz'

            breakCallback foo, bar, baz
            
        promise.kept () -> test.fail 'Should not succeed'
        promise.broken (foo, bar, baz) ->

            test.equal foo, 'foo'
            test.equal bar, 'bar'
            test.equal baz, 'baz'

            do test.done

        promise.execute 'foo', 'bar', 'baz'
