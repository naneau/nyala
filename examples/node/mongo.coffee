# Query Mongo
#
# Relies on https://github.com/christkv/node-mongodb-native

{Db, Connection, Server} = require 'mongodb'
{Promise, PromiseChain} = require '../../lib'

# Connection info
host = '127.0.0.1'
port = Connection.DEFAULT_PORT

# A simple promise that will open a mongodb connection, and select a collection
collectionPromise = new Promise () ->
    db = new Db 'test', new Server host, port
    db.open (error, connection) =>
    
        # We break the promise if there's an error here
        @break error if error?
        
        db.collection 'test', (error, collection) =>
            # And here
            @break error if error?
            
            # But if all goes well, we can keep our promise and have a collection to play with :)
            @keep collection

# Should this promise be kept, we can work with the collection
# We are now *not* indented 3 levels
collectionPromise.kept (collection) ->

    # We can use a PromiseChain to set up a (complicated) query
    chain = new PromiseChain
    
    # We can add multiple functions in a row, each with an error check in the callback
    # With just function chaining you can't get this level of control,
    # and with all the callbacks you'll end up scrolling out of your screen
    chain.add () -> collection.find someInteger: '$gt': 10, (args...) => @keep args...
    
    # For instance, you can add conditions
    # Note how all the arguments from the callback are pushed to the next chain
    # See the "assertEach" below for error checking
    chain.add (error, cursor) ->
        if true
            cursor.skip 0, (args...) => @keep args...
        else
            cursor.skip 10, (error, cursor) => @keep cursor
            
    # Limit to 10 rows
    chain.add (error, cursor) -> cursor.limit 10, (args...) => @keep args...
    
    # Execute the query and return results
    chain.add (error, cursor) ->
        cursor.toArray (error, data) => 
            return @break error if error?
            @keep data
    
    # The chain will result in a set of data, as the last step calls toArray
    chain.kept (results) -> console.log results
    
    # Since every step in the chain will get "error" as its first param,
    # we can write a single assert for every step, reducing complexity.
    # This assert will check the incoming arguments for every promise in the chain
    chain.assertEach = (error, args...) -> not error?
    
    chain.broken (error) -> console.log "Chain broken: #{error}"
    
    # Start the chain
    chain.execute()
    
collectionPromise.execute()

collectionPromise.broken (error) -> console.log "Could not connect to mongodb: #{error}"