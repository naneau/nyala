# Burst of promises
#
# When bursting, all promises get executed in paralel
class PromiseBurst extends PromiseBunch
    
    # Constructor
    constructor: (args...) ->
        super args...
        
        # Stack for the results
        @aggregatedResults = []
        
    # Loop over each result
    eachResult: (fn, scope = null) -> fn.apply scope, results for results in @aggregatedResults
    
    # Run our stack
    runStack: (args..., keepCallback, breakCallback) ->
        # Stack for the results
        @aggregatedResults = []
        
        # Array of promises we've kept so far
        kept = []
        keepOne = (promise) =>
            # We can't let a promise be kept more than once
            throw new Error "A promise was kept more than once" if (checkPromise for checkPromise in kept when checkPromise is promise).length > 0
            
            kept.push promise
            @keep @aggregatedResults if kept.length is @promises.length
        
        # Take every promise and execute it right away
        for promise in @promises
            do (promise) =>
                if not @promiseIsSetUp promise
                    # Promise has been kept
                    promise.kept (keptArgs...) =>
                        # Push results to the stack
                        @aggregatedResults.push keptArgs
                        keepOne promise
                    
                    # Promise was broken, we can fail our bust right here and now
                    promise.broken (brokenArgs...) => @break brokenArgs...
                
                    @addSetUpPromise promise

                promise.execute args...

moduleExport 'PromiseBurst', PromiseBurst