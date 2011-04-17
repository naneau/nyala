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
        @setUpPromises = []
        
        # Add all passed promises
        @add promise for promise in args
        
        # Return this to not get the "for" return
        this
        
    # Add a promise to the chain, chainable
    add: (args...) ->
        # Turn functions into promises
        if typeof args[0] is 'function'
            promise = new Promise args... 
        else 
            promise = args[0]
        
        @promises.push promise
        
        this
        
    # Run through our stack of promises and execute each one
    runStack: (args..., keepCallback, breakCallback) ->
        stack = @promises
        
        # We do need a stack
        return if stack.length is 0
            
        # Recursively called "next", promise doesn't have to be aware it's in a chain
        next = (index, args...) =>
            # Sanity check, if we reached the end of the array, we can assume all promises have been kept
            return @keep args... if not stack[index]?
            
            # Promise we're about to execute
            promise = stack[index]
            
            # Set up listeners if we haven't already
            if (checkPromise for checkPromise in @setUpPromises when checkPromise is promise).length is 0
                @setUpPromises.push promise
                
                # We listen to the fail, which will break the chain
                promise.broken (brokenArgs...) => @break brokenArgs...
            
                # Success on the other hand, will continue the chain with the next promise
                promise.kept (keptArgs...) -> next (index + 1), keptArgs...
            
            # Assert each promise with @assertEach if it is set
            return @break "Assertion failed on step #{index + 1}" if @assertEach? and not @assertEach args... 
            
            # Execute it
            promise.execute args...
        
        # Let's start at the beginning, shall we? :)
        next 0, args...

moduleExport 'PromiseChain', PromiseChain