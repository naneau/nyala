# Unit Test for a single promise

# Nodeunit's test case
testCase = (require 'nodeunit').testCase

# Nyala
Nyala = require '../lib'
Promise = Nyala.Promise
PromiseChain = Nyala.PromiseChain

module.exports = testCase 

    'Promises can be put into a bursts and execute': (test) ->
        test.expect 4
        
        chain = new PromiseChain
        p1 = new Promise () -> 
            test.ok true
            do @keep
        p2 = new Promise () -> 
            test.ok true
            do @keep
        p3 = new Promise () -> 
            test.ok true
            do @keep
            
        chain.add p1
        chain.add p2
        chain.add p3                
        
        chain.broken () -> test.fail 'We should not fail'        
        chain.kept () ->
            test.ok true
            do test.done
            
        do chain.execute

    'Promises can be put into a bursts and send results to kept handlers': (test) ->
        test.expect 7

        chain = new PromiseChain
        p1 = new Promise () -> 
            test.ok true
            @keep 'foo'
        p1.kept (foo) -> test.equal foo, 'foo'
        
        p2 = new Promise () -> 
            test.ok true
            @keep 'bar'
        p2.kept (bar) -> test.equal bar, 'bar'
        
        p3 = new Promise () -> 
            test.ok true
            fn = () => @keep 'baz'
            process.nextTick fn
        p3.kept (baz) -> test.equal baz, 'baz'
        
        chain.add p1
        chain.add p2
        chain.add p3                

        chain.broken () -> test.fail 'We should not fail'        
        chain.kept () ->
            test.ok true
            do test.done

        do chain.execute
