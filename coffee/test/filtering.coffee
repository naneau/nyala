# Unit Test for a single promise

# Nodeunit's test case
testCase = (require 'nodeunit').testCase

{Promise} = require '../lib'

module.exports = testCase 

    setUp: (callback) ->
        do callback
    
    # Filter
    'Promises accept a filter': (test) ->
        test.expect 1
        
        # Filters 3 strings into 1, note that this is tricky because array gets turned into single item (!!!)
        filter = (foo, bar, baz) -> "#{foo}:#{bar}:#{baz}"
        
        promise = new Promise (foo, bar, baz) -> @keep foo, bar, baz
        promise.filter = filter
        
        promise.kept (result) -> 
            test.equal (filter 'foo', 'bar', 'baz'), result
            do test.done
        
        promise.execute 'foo', 'bar', 'baz'
        
    # Filter
    'Filters can return arrays for non-singular filtering': (test) ->
        test.expect 3

        # Filters 3 strings into 1, note that this is tricky because array gets turned into single item (!!!)
        filter = (foo, bar, baz) -> [baz, bar, foo]

        promise = new Promise (foo, bar, baz) -> @keep foo, bar, baz
        promise.filter = filter

        promise.kept (baz, bar, foo) -> 
            test.equal baz, 'baz'
            test.equal bar, 'bar'
            test.equal foo, 'foo'
            do test.done

        promise.execute 'foo', 'bar', 'baz'    