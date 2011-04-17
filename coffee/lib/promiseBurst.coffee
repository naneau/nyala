# Burst of promises
#
# When bursting, all promises get executed in paralel
class PromiseBurst extends PromiseBunch
    
    # Run our stack
    runStack: (args..., keepCallback, breakCallback) ->
        # Array of promises we've kept so far
        kept = []
        keepOne = (promise) =>
            # We can't let a promise be kept more than once
            throw new Error "A promise was kept more than once" if (checkPromise for checkPromise in kept when checkPromise is promise).length > 0
            
            kept.push promise
            do @keep if kept.length is @promises.length
        
        # Take every promise and execute it right away
        for promise in @promises
            do (promise) =>
                if not @promiseIsSetUp promise
                    promise.kept (keptArgs...) -> keepOne promise
                    promise.broken (brokenArgs...) => @break brokenArgs...
                
                    @addSetUpPromise promise

                promise.execute args...

moduleExport 'PromiseBurst', PromiseBurst