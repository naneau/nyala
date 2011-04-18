# Nyala

Nyala is a promise library for javascript. It was partially inspired by [an article](http://blog.fogus.me/2011/04/12/node-js-is-dead-long-live-node/) by Michael Fogus. It is written in [CoffeeScript](http://coffeescript.org), and targets both the browser and [node.js](http://nodejs.org). For more information, see [the manual](http://naneau.net/nyala), or look at [some examples](https://github.com/naneau/nyala/tree/master/examples).

Although written in CoffeeScript, Nyala explicitly targets both JavaScript and CoffeeScript environments, this readme uses JavaScript, but [the manual](http://naneau.net/nyala) also offers CoffeeScript.

## Promises

Promises are a way to deal with asynchrony in your code. JavaScript, by nature, lends itself very well to writing asynchronously structured applications. Promises help you manage them. Instead of passing callbacks to all functions that will perform an asynchronous action, you retrieve a Promise from them and work with that, making it easier to break your application up into manageable chunks. The following example

    someFunc('foo', 'bar', function(error, data) {
        if (!error) {
            someOtherFunc(data);
        } else {
            notifyUserOfFailure(error);
        }
    });
    
could become

    promise = new Promise(function(keepCallback, breakCallback) {
        someFunc('foo', 'bar', function(error, data) {
            if (error) {
                breakCallback(error);
            } else {
                keepCallback(data);
            }
        });
    });
    
    promise.kept(someOtherFunc);
    promise.broken(notifyUserOfFailure);
    
    promise.execute();

While this may seem more tedious, at first, there are several benefits to this approach. For instance, Promises can be passed around in your application, and, if applicable, be reused. More than one `kept` handler can be assigned. Promises make dealing with asynchrony a lot more painless.

## Promise Chaining

When doing asynchronous things in series, you'll end up indenting for every link in the chain. It is not uncommon to see javascript like this:

    foo('foo', function(foo) {
        foo.bar(function(bar){
            bar.baz(function(quux) {
                doSomethingUsefulWith(quux);
            });
        });
    });

With more than a couple of steps in your chain this quickly becomes messy and unmanageable. Nyala offers you a PromiseChain class, which executes all promises serially. The previous example could become:

    chain = new PromiseChain;
    
    chain.add(function(keepCallback) {
        foo('foo', keepCallback);
    }).add(function(bar, keepCallback) {
        bar.baz(keepCallback);
    });
    
    chain.kept(function(quux) {
        doSomethingUsefulWith(quux);
    });
    
    chain.execute();
    
Just like a Promise, these chains can be passed around, and different `kept` handlers can be attached. Since every step in the chain is also a separate Promise, they can be managed separately, not violating [Demeter's law](http://en.wikipedia.org/wiki/Law_of_Demeter).

## Bursting

Another problem with asynchronous code is what to do when you need the results of a couple of functions, but those do not depend on one another. In node you might for instance need to get the contents of a couple of files, in no particular order.

You could chain the calls, but that would not be very efficient. Keeping track of their respective states manually is also rather strenuous. Nyala lets you group Promises into "bursts". A burst will execute all Promises at once, and "keep" its own promise, when all promises keep theirs.

    burst = new PromiseBurst;
    
    burst.add(function(keep) {
        doSomethingAsynchronousAndExpensive(keep);
    }).add(function(keep) {
        doSomethingElse(keep);
    });
    
    // You can also add Promises, that already have a `kept` handler
    promise = new Promise(function(keep) {
        doAnotherThing(keep);
    });
    promise.kept(function(results){
        // Do something useful with the results
    });
    burst.add(p3);

    burst.kept(function() {
        // All three have been executed
        // you can use burst.eachResult(function(){}); to get at the results
    });
    
    burst.execute();