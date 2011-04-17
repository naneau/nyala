# PromiseChain
#        
# Promise chain has a set of promises that it will execute in order they are set
# 
# You can use @assertEach as an assert on all promises
class PromiseChain extends PromiseBunch
    
    # Run through our stack of promises and execute each one, sequentially
    runStack: (args..., keepCallback, breakCallback) ->
        
        # Recursively called "next", promise doesn't have to be aware it's in a chain
        next = (index, args...) =>
        
            # Sanity check, if we reached the end of the array, we can assume all promises have been kept
            return @keep args... if not @promises[index]?
            
            # Promise we're about to execute
            promise = @promises[index]
            
            # Set up listeners if we haven't already
            if not @promiseIsSetUp promise
                
                # We listen to the fail, which will break the chain
                promise.broken (brokenArgs...) => @break brokenArgs...
            
                # Success on the other hand, will continue the chain with the next promise
                promise.kept (keptArgs...) -> next (index + 1), keptArgs...
                
                # Track that we have set this one up
                @addSetUpPromise promise
            
            # Assert each promise with @assertEach if it is set
            return @break "Assertion failed on step #{index + 1}" if @assertEach? and not @assertEach args... 
            
            # Execute it
            promise.execute args...
        
        # Let's start at the beginning, shall we? :)
        next 0, args...

moduleExport 'PromiseChain', PromiseChain