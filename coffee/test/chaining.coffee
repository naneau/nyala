# Unit Test for a single promise

# Nodeunit's test case
testCase = (require 'nodeunit').testCase

# Nyala
Nyala = require '../lib'
Promise = Nyala.Promise
PromiseChain = Nyala.PromiseChain

module.exports = testCase 

    setUp: (callback) ->
        do callback
    
    'Promises can be chained and execute': (test) ->
        test.expect 4
        
        chain = new PromiseChain
        chain.add () -> 
            test.ok true
            do @keep
        chain.add () -> 
            test.ok true
            do @keep
        chain.add () -> 
            test.ok true
            do @keep
        
        chain.broken () -> test.fail 'We should not fail'        
        chain.kept () ->
            test.ok true
            do test.done
            
        do chain.execute
    
    'Promises can be chained and pass params to the next item in the chain': (test) ->
        test.expect 4

        chain = new PromiseChain
        chain.add () -> 
            test.ok true
            @keep 'foo'
        chain.add (foo) -> 
            test.equal foo, 'foo'
            @keep 'bar'
        chain.add (bar) -> 
            test.equal bar, 'bar'
            @keep 'baz'
            
        chain.broken () -> test.fail 'We should not fail'
        chain.kept (baz) ->
            test.equal baz, 'baz'
            do test.done

        do chain.execute
        
    'Promises in a chain can fail and give a reason for that': (test) ->
        test.expect 3

        chain = new PromiseChain
        chain.add () -> 
            test.ok true
            do @keep
        chain.add () -> 
            test.ok true
            @break 'foo'
        chain.add () -> 
            test.fail 'We should not get to the third step in the chain'
        
        # We expect to arrive here
        chain.broken (foo) ->
            test.equal foo, 'foo'
            do test.done
            
        # But not here
        chain.kept () -> test.fail 'We should not succeed'

        do chain.execute
        
    'A PromiseChain accepts both Promise instances and bare functions': (test) ->
        test.expect 4

        chain = new PromiseChain
        chain.add new Promise () -> 
            test.ok true
            do @keep
        chain.add () -> 
            test.ok true
            do @keep
        chain.add new Promise () -> 
            test.ok true
            do @keep

        chain.broken () -> test.fail 'We should not fail'        
        chain.kept () ->
            test.ok true
            do test.done

        do chain.execute
    
    'A PromiseChain accepts scoped functions': (test) ->
        test.expect 5
    
        chain = new PromiseChain
        
        # Some kind of scope
        @foo = 'foo'
        
        chain.add (success, fail) =>
            test.equal @foo, 'foo'
            test.ok true
            success 'foo'
            
        chain.add (foo, success, fail) ->
            test.equal foo, 'foo'
            success 'bar'
            
        chain.add (bar, success, fail) ->
            test.equal bar, 'bar'
            do success
    
        chain.broken () -> test.fail 'We should not fail'        
        chain.kept (foo) ->
            test.ok true
            do test.done
    
        do chain.execute

    'A PromiseChain can be tapped': (test) ->
        test.expect 3

        chain = new PromiseChain
        
        chain.tap (foo) -> test.equal foo, 'foo'
        
        chain.add -> process.nextTick () => @keep 'foo'
        chain.add -> process.nextTick () => @keep 'foo'
        chain.add -> process.nextTick () => @keep 'foo'
        
        chain.broken () -> test.fail 'We should not fail'        
        chain.kept (foo) -> do test.done

        do chain.execute
