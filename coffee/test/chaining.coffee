# Unit Test for a single promise

# Nodeunit's test case
testCase = (require 'nodeunit').testCase

Promise = require '../lib/promise'
PromiseChain = require '../lib/promiseChain'

module.exports = testCase 

    setUp: (callback) ->
        do callback
    
    'Promises can be chained and execute': (test) ->
        test.expect 4
        
        chain = new PromiseChain
        chain.add () -> 
            test.ok true
            do @success
        chain.add () -> 
            test.ok true
            do @success
        chain.add () -> 
            test.ok true
            do @success
        
        chain.on 'fail', () -> test.fail 'We should not fail'        
        chain.on 'success', () ->
            test.ok true
            do test.done
            
        do chain.execute
    
    'Promises can be chained and pass params to the next item in the chain': (test) ->
        test.expect 4

        chain = new PromiseChain
        chain.add () -> 
            test.ok true
            @success 'foo'
        chain.add (foo) -> 
            test.equal foo, 'foo'
            @success 'bar'
        chain.add (bar) -> 
            test.equal bar, 'bar'
            @success 'baz'
            
        chain.on 'fail', () -> test.fail 'We should not fail'
        chain.on 'success', (baz) ->
            test.equal baz, 'baz'
            do test.done

        do chain.execute
        
    'Promises in a chain can fail and give a reason for that': (test) ->
        test.expect 3

        chain = new PromiseChain
        chain.add () -> 
            test.ok true
            do @success
        chain.add () -> 
            test.ok true
            @fail 'foo'
        chain.add () -> 
            test.fail 'We should not get to the third step in the chain'
        
        # We expect to arrive here
        chain.on 'fail', (foo) ->
            test.equal foo, 'foo'
            do test.done
            
        # But not here
        chain.on 'success', () -> test.fail 'We should not succeed'

        do chain.execute
        
    'A PromiseChain accepts both Promise instances and bare functions': (test) ->
        test.expect 4

        chain = new PromiseChain
        chain.add new Promise () -> 
            test.ok true
            do @success
        chain.add () -> 
            test.ok true
            do @success
        chain.add new Promise () -> 
            test.ok true
            do @success

        chain.on 'fail', () -> test.fail 'We should not fail'        
        chain.on 'success', () ->
            test.ok true
            do test.done

        do chain.execute
        
    'A PromiseChain accepts scoped functions': (test) ->
        test.expect 4

        chain = new PromiseChain
        chain.add (success, fail) =>
            test.ok true
            success 'foo'
        chain.add (foo, success, fail) =>
            test.equal foo, 'foo'
            success 'bar'
        chain.add (bar, success, fail) =>
            test.equal bar, 'bar'
            do success

        chain.on 'fail', () -> test.fail 'We should not fail'        
        chain.on 'success', (foo) ->
            test.ok true
            do test.done

        do chain.execute

