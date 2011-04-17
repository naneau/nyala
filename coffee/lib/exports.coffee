# Simple export function that will support both the browser and node.js
moduleExport = (name, val) ->
    if module?.exports?
        module.exports[name] = val 
    else
        window[name] = val