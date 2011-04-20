# This is an abstract class for "bunches" of promises
#
# Promises get made in bunches, right?
#
# 
class PromiseBunch extends Promise
    
    # Constructor
    constructor: (args...) ->
        # Set ourselves up as a promise
        super (executeArgs...) =>
            # We assume that when there are no promises in a bunch, 
            # we keep our own promise that we execute all of them
            return do @keep if @promises.length is 0
            
            @runStack executeArgs...
            
        # Init array of promises
        @promises = []
        @setUpPromises = []
        
        # Add all passed promises
        @add promise for promise in args
        
        # Undefined here, bit of a coffeescript "everything is an expression" problem
        undefined
        
    # Add a promise to the chain, chainable
    add: (args...) ->
        # Turn functions into promises
        if typeof args[0] is 'function'
            promise = new Promise args... 
        else 
            promise = args[0]
        
        @promises.push promise
        
        this
    
    # Add a deferred promise
    addDeferred: (deferred, args...) ->
        @promises.push new Promise (bunchArgs...) ->
            deferredPromise = deferred args..., bunchArgs...
            
            deferredPromise.kept (keptArgs...) => @keep keptArgs...
            deferredPromise.broken (brokenArgs...) => @break brokenArgs...
            do deferredPromise.execute bunchArgs...
            
        chain
        
    # Is a promise set up?
    promiseIsSetUp: (promise) -> (checkPromise for checkPromise in @setUpPromises when checkPromise is promise).length > 0
    
    # Record that a promise is set up
    addSetUpPromise: (promise) -> @setUpPromises.push promise
    
    # Run through our stack of promises and execute each one
    runStack: (args..., keepCallback, breakCallback) ->