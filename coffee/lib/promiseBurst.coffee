# Burst of promises
#
# When bursting, all promises get executed in paralel
class PromiseBurst extends PromiseBunch
    
    # Constructor
    constructor: (args...) ->
        super args...
        
        # Stack for the results
        @aggregatedResults = []
        
    # Unwrapped results
    unWrapResults: () -> (result[0] for result in @aggregatedResults)

    # Loop over each result
    eachResult: (fn, scope = null) -> fn.apply scope, results for results in @aggregatedResults
    
    # Create array of values using fn, fn can only return a singular value
    mapResults: (fn, scope = null) ->
        mapped = []
        mapped.push fn.apply scope, results for results in @aggregatedResults
        mapped
        
    # Get all results that `fn results` to true
    detectResults: (fn, scope = null) ->
        detected = []
        for results in @aggregatedResults
            if fn.apply scope, results 
                detected.push results 
        detected
    
    # Reduce results using +=, rather useful for strings and integers
    addResults: (start) ->
        start += result for result in @aggregatedResults
        start
        
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