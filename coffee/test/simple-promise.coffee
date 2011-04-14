# Unit Test for a single promise

# Nodeunit's test case
testCase = (require 'nodeunit').testCase

Promise = require '../lib/promise'

# Test case promise
module.exports = testCase 

    setUp: (callback) ->
        do callback
        
    'Promises execute': (test) ->
        test.expect 0
        
        promise = new Promise () -> do test.done
        do promise.execute
    
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
        
        # @success is asynchronous
        promise = new Promise () -> 
            fn = () => do @success
            process.nextTick fn
            
        promise.on 'fail', () -> test.fail 'Should not fail'
        promise.on 'success', () -> do test.done    

        do promise.execute
    
    'Promises can record failure': (test) ->
        test.expect 0

        # @success is asynchronous
        promise = new Promise () -> 
            fn = () => do @fail
            process.nextTick fn
            
        promise.on 'success', () -> test.fail 'Should not succeed'
        promise.on 'fail', () -> do test.done    

        do promise.execute
    
    'Promises can record success and pass results': (test) ->
        test.expect 3

        # @success is asynchronous
        promise = new Promise () -> 
            fn = () => @success 'foo', 'bar', 'baz'
            process.nextTick fn
            
        promise.on 'fail', () -> test.fail 'Should not fail'
        promise.on 'success', (foo, bar, baz) -> 
            test.equal foo, 'foo'
            test.equal bar, 'bar'
            test.equal baz, 'baz'
        
            do test.done    

        do promise.execute

    'Promises can record failure and pass results': (test) ->
        test.expect 3

        # @success is asynchronous
        promise = new Promise () -> 
            fn = () => @fail 'foo', 'bar', 'baz'
            process.nextTick fn
            
        promise.on 'success', () -> test.fail 'Should not succeed'
        promise.on 'fail', (foo, bar, baz) -> 
            test.equal foo, 'foo'
            test.equal bar, 'bar'
            test.equal baz, 'baz'

            do test.done    

        do promise.execute
        
    'Promises can execute with a different scope and still succeed': (test) ->
        test.expect 6
    
        promise = new Promise (foo, bar, baz, success, fail) => 
            test.equal foo, 'foo'
            test.equal bar, 'bar'
            test.equal baz, 'baz'
            
            success foo, bar, baz
            
        promise.on 'fail', () -> test.fail 'Should not fail'
        promise.on 'success', (foo, bar, baz) ->
        
            test.equal foo, 'foo'
            test.equal bar, 'bar'
            test.equal baz, 'baz'
        
            do test.done
    
        promise.execute 'foo', 'bar', 'baz'

    'Promises can execute with a different scope and still fail': (test) ->
        test.expect 6

        promise = new Promise (foo, bar, baz, success, fail) => 
            test.equal foo, 'foo'
            test.equal bar, 'bar'
            test.equal baz, 'baz'

            fail foo, bar, baz
            
        promise.on 'success', () -> test.fail 'Should not succeed'
        promise.on 'fail', (foo, bar, baz) ->

            test.equal foo, 'foo'
            test.equal bar, 'bar'
            test.equal baz, 'baz'

            do test.done

        promise.execute 'foo', 'bar', 'baz'
