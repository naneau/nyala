# Writing a couple of files, then reading them
#
# Done in bursts

# Files to write to
files = ['/tmp/tmp1.txt', '/tmp/tmp2.txt', '/tmp/tmp3.txt']

# Contents to put in them
contents = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

# Nyala
{Promise, PromiseBurst} = require '../../lib'

fs = require 'fs'

# Create burst for writing the files, but also one to read them again
writeBurst = new PromiseBurst
readBurst = new PromiseBurst

for file in files
    do (file) ->
    
        # Simple async file write
        writeBurst.add () ->
            fs.writeFile file, contents, 'utf8', (error) =>
                if error
                    @break error
                else
                    do @keep
                    
        # And the same in reverse
        readBurst.add () ->
            fs.readFile file, 'utf8', (error, data) =>
                if error
                    @break error
                else
                    @keep data
                
        
# All files have been written, read them again
writeBurst.kept () -> do readBurst.execute

# Get the results of the file reading
readBurst.kept (results) -> console.log results

# Start the whole chain
do writeBurst.execute