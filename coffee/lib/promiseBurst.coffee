# Burst of promises
#
# When bursting, all promises get executed in paralel
class PromiseBurst extends PromiseBunch
    
    # Run our stack
    runStack: (args...) ->
        
        kept = []
        keepOne = (promise) =>
            throw new Error "A promise was kept more than once" if (checkPromise for promise in kept when checkPromise is promise).length > 0
            
            kept.push promise
            do @success if kept.length is @promises.length
        
        # Take every promise and execute it right away
        for promise in @promises
            if not @promiseIsSetUp promise
                promise.kept (keptArgs...) -> keepOne promise
                promise.broken (brokenArgs...) => @break brokenArgs...
                
                @addSetUpPromise promise

            promise.execute args...

moduleExport 'PromiseBurst', PromiseBurst