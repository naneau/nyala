# Promise 
#
# You can use two utility methods:
#
# * `@filter` will be called when you call `@success`, all arguments will be passed, and whatever you return will be used as the result
# * `@assert` allows you to check the input, which is mainly useful when chaining, return false when you don't accept input
#
class Promise

    # Constructor
    constructor: (args...) ->
        # Throw error
        throw new Error "No function passed to Promise" if args.length is 0
        
        # Second argument passed is the scope to bind the function to, but this is optional
        @scope = if args.length >= 2 then args[1] else this
        
        # Last argument passed is the function to execute
        @func = args[0]
        
        # Handlers
        @brokenHandlers = []
        @keptHandlers = []
        
        # Keep track of which chains we're in
        @inChains = []
        
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
        return @break 'Assertion failed' if @assert? and not @assert args... 

        # Map success and fail if we're differently scoped...
        # We might want to "if @scope isnt this" here
        args.push (args...) => @keep args...
        args.push (args...) => @break args...
                
        # Call the actual function
        @func.apply @scope, args
        
    # Record failure
    break: (args...) -> handler args... for handler in @brokenHandlers

    # Record success
    keep: (args...) ->
        # Filter result, where we also make sure we get an array back, to play well with the args... splat
        # I think it may be better if I add a simple Filter class that mirrors Promise functionality, or at least add
        # a callback here
        args = @filter args... if @filter
        args = [args] if not Array.isArray args

        # Promise is mainly a wrapper around event
        handler args... for handler in @keptHandlers
        
    # Record we're in a chain, to avoid double callbacks
    putInChain: (chain) -> @inChains.push chain
    
    # Check if we're in a chain
    isInChain: (checkChain) -> (chain for chain in @inChains when chain is checkChain).length > 0
# Export
moduleExport 'Promise', Promise