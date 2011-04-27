exec = (require 'child_process').exec
fs = require 'fs'

# Build Nyala
build = (callback) ->
    
    # See, this is one of those places where you could really use a promise chain =]
    
    # Build lib
    cmd = 'coffee -o ./lib -j -c `find ./coffee/lib -name \\*.coffee`'
    exec cmd, (err, stdout, stderr) ->
        throw new Error "Could not execute #{cmd}: #{stderr}" if err?
        
        fs.renameSync 'lib/concatenation.js', 'lib/index.js'
        
        # Create browser files, one minified version
        fs.writeFileSync 'browser/nyala.js', fs.readFileSync 'lib/index.js'
        
        uglifyCmd = 'uglifyjs -o browser/nyala-min.js browser/nyala.js'
        exec uglifyCmd, (err, stdout, stderr) ->
            throw new Error "Could not execute #{uglifyCmd}: #{stderr}" if err?
        
            # Build test cases
            exec "coffee -o ./test -c coffee/test", (err, stdout, stderr) ->
    
                throw new Error "Could not execute #{cmd}" if err?
                do callback

# Build coffeescript into js
task 'build', 'Build CoffeeScript lib/test into JS lib/test', ->

    console.log 'Building...'
    
    build () ->
        console.log 'Build complete'

# Run nodeunit
task 'test', 'Run tests through nodeunit', ->
    console.log 'Running test suite, building first'
    
    # We need to build first
    build () ->
        console.log 'Build complete, running nodeunit'
        exec "nodeunit test", (err, stdout, stderr) ->
            process.stdout.write stdout