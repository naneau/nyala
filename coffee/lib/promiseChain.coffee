Promise = require './promise'

# PromiseChain
#        
# Promise chain has a set of promises that it will execute in order they are set
# 
# You can use @assertEach as an assert on all promises
class PromiseChain extends Promise
    
    # Constructor
    constructor: (args...) ->
        
        # We're just a regular Promise too, @runStack gets called when executing
        super (args...) => @runStack args...
            
        # Init array of promises
        @promises = []
        
        # Add all passed promises
        @add promise for promise in args
        
        # Return this to not get the "for" return
        this
        
    # Add a promise to the chain, chainable
    add: (promise) ->
        
        # Turn functions into promises
        promise = new Promise promise if typeof promise is 'function'
            
        @promises.push promise
        
        this
        
    # Run through our stack of promises and execute each one
    runStack: (args...) ->
        stack = @promises
        
        # We do need a stack
        return if stack.length is 0
            
        # Recursively called "next", promise doesn't have to be aware it's in a chain
        next = (index, args...) =>
            # Sanity check, if we reached the end of the array, we can assume success
            return @success args... if not stack[index]?
            
            # Promise we're about to execute
            promise = stack[index]
            
            # We listen to the fail, which will break the chain
            failed = false
            promise.on 'fail', (args...) =>
                # We keep a boolean here in case somebody calls both fail and success
                failed = true
                @fail args...
            
            # Success on the other hand, will continue the chain with the next promise
            promise.on 'success', (args...) -> 
                next (index + 1), args... if not failed
                
            # Assert each promise with @assertEach if it is set
            return @fail "Assertion failed on step #{index + 1}" if @assertEach? and not @assertEach args... 
            
            # Execute it
            promise.execute.apply promise, args
        
        # Let's start at the beginning, shall we? :)
        next 0, args...

module.exports = PromiseChain