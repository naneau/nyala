# Unit Test for a single promise

# Nodeunit's test case
testCase = (require 'nodeunit').testCase

Promise = require '../lib/promise'

module.exports = testCase 

    setUp: (callback) ->
        do callback
    
    'Promises accept an assert that succeeds': (test) ->
        test.expect 1
        
        promise = new Promise (foo, bar, baz) -> @success foo, bar, baz
        promise.assert = (foo, bar, baz) -> foo is 'foo'
        
        promise.kept (foo, bar, baz) -> 
            test.equal foo, 'foo'
            do test.done
        promise.broken (result) -> test.fail 'We should not fail'
        
        promise.execute 'foo', 'bar', 'baz'
        
    'Promises accept an assert that fails': (test) ->
        test.expect 0
    
        promise = new Promise (foo, bar, baz) -> @success foo, bar, baz
        promise.assert = (foo, bar, baz) -> foo is 'quux'
    
        promise.kept (result) -> test.fail 'We should not succeed if the assertion fails'
        promise.broken (result) -> 
            do test.done
    
        promise.execute 'foo', 'bar', 'baz'
    
