# Promise 
#
# You can use two utility methods:
#
# * `@filter` will be called when you call `@success`, all arguments will be passed, and whatever you return will be used as the result
# * `@assert` allows you to check the input, which is mainly useful when chaining, return false when you don't accept input
#
class Promise

    # Constructor
    constructor: (@func) ->
        
        # Handlers
        @brokenHandlers = []
        @keptHandlers = []
        
        undefined
    
    # Add a handler to the broken 
    kept: (handler) ->
        @keptHandlers.push handler
        this
        
    # Add a handler for when we break the promise
    broken: (handler) -> 
        @brokenHandlers.push handler
        this
        
    # Execute the stack
    execute: (args...) ->
        # Assert
        return @fail 'Assertion failed' if @assert? and not @assert args... 

        # Map success and fail
        success = (args...) => @success args...
        fail = (args...) => @fail args...
        
        # Call the actual function
        @func args..., success, fail
        
    # Record failure
    fail: (args...) -> handler args... for handler in @brokenHandlers

    # Record success
    success: (args...) ->
        # Filter result, where we also make sure we get an array back, to play well with the args... splat
        # I think it may be better if I add a simple Filter class that mirrors Promise functionality, or at least add
        # a callback here
        args = @filter args... if @filter
        args = [args] if not Array.isArray args

        # Promise is mainly a wrapper around event
        handler args... for handler in @keptHandlers

# Export
module.exports = Promise