events = require 'events'

# Promise 
#
# You can use two utility methods:
#
# * `@filter` will be called when you call `@success`, all arguments will be passed, and whatever you return will be used as the result
# * `@assert` allows you to check the input, which is mainly useful when chaining, return false when you don't accept input
#
class Promise extends events.EventEmitter

    # Constructor
    constructor: (@func) -> undefined
    
    # Record failure
    fail: (args...) -> @emit 'fail', args...
    
    # Record success
    success: (args...) ->
        # Filter result, where we also make sure we get an array back, to play well with the args... splat
        # I think it may be better if I add a simple Filter class that mirrors Promise functionality, or at least add
        # a callback here
        args = @filter args... if @filter
        args = [args] if not Array.isArray args
        
        # Promise is mainly a wrapper around event
        @emit 'success', args...
        
    # Execute the stack
    execute: (args...) ->
        # Assert
        return @fail 'Assertion failed' if @assert? and not @assert args... 

        # Map success and fail
        success = (args...) => @success args...
        fail = (args...) => @fail args...
        
        # Call the actual function
        @func args..., success, fail

# Export
module.exports = Promise