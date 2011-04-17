# Unit Test for a single promise

# Nodeunit's test case
testCase = (require 'nodeunit').testCase

# Nyala
Nyala = require '../lib'
Promise = Nyala.Promise
PromiseBurst = Nyala.PromiseBurst

module.exports = testCase 

    'Promises can be put into bursts and execute': (test) ->
        test.expect 4
        
        chain = new PromiseBurst
        p1 = new Promise (keepCallback, breakCallback) ->
            test.ok true
            process.nextTick keepCallback
        p2 = new Promise () ->
            test.ok true
            process.nextTick () => do @keep
        p3 = new Promise () ->
            test.ok true
            process.nextTick () => do @keep
            
        chain.add p1
        chain.add p2
        chain.add p3                
        
        chain.broken () -> test.fail 'We should not fail'        
        chain.kept () ->
            test.ok true
            do test.done
            
        do chain.execute
    
    'Promises can be put into bursts, and break': (test) ->
        test.expect 3
        chain = new PromiseBurst
        p1 = new Promise () ->
            test.ok true
            process.nextTick () => do @break
        p2 = new Promise (keepCallback) ->
            test.ok true
            process.nextTick keepCallback
        p3 = new Promise (keepCallback) ->
            test.ok true
            process.nextTick keepCallback
            
        chain.add p1
        chain.add p2
        chain.add p3
        
        # We expect the chain to break
        chain.broken () -> do test.done
        chain.kept () -> 
            test.fail 'The promise was kept'
    
        do chain.execute
    
    'Promises can be put into a burst and send results to kept handlers outside of the burst': (test) ->
        test.expect 7
    
        chain = new PromiseBurst
        p1 = new Promise () -> 
            test.ok true
            process.nextTick () => @keep 'foo'
        p1.kept (foo) -> test.equal foo, 'foo'
        
        p2 = new Promise () -> 
            test.ok true
            process.nextTick () => @keep 'bar'
        p2.kept (bar) -> test.equal bar, 'bar'
        
        p3 = new Promise () -> 
            test.ok true
            process.nextTick () => @keep 'baz'
        p3.kept (baz) -> test.equal baz, 'baz'
        
        chain.add p1
        chain.add p2
        chain.add p3                
    
        chain.broken () -> test.fail 'We should not fail'        
        chain.kept () ->
            test.ok true
            do test.done
    
        do chain.execute
