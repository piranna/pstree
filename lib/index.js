
// Dependencies
var readdir = require('fs').readdir
var map = require('async').map
var getProcessStat = require('./getProcessStat')

/**
 * Checks if the number is `NaN` (Not a Number)
 * @access private
 * @param  {Number}  number The number will be checked if its a `NaN`
 * @return {Boolean}        Returns `true` if the number is `NaN`
 */
function filterNumber(number)
{
  return !isNaN(number)
}

/**
 * This callback creates a empty object on every `process.child`
 * @param    {Object} pids    This object holds every process with
 *                            the `pid` as key
 * @param    {Object} process The process object
 * @return   {Object}         Returns a object
 */
function reducePids(pids, process)
{
  pids[process.pid] = process

  process.childs = {}

  return pids
}

/**
 * Reads the `/proc` directory and maps the processes
 * @access public
 * @param  {Function} callback The callback returns the
 * @return {Function}          Returns the callback
 */
function pstree(callback)
{
  readdir('/proc', function(error, files)
  {
    if(error) return callback(error)

    map(files.filter(filterNumber), getProcessStat, function(err, results)
    {
      if(error) return callback(error)

      var pids = results.reduce(reducePids, {})

      var result = results.reduce(function(godfathers, process)
      {
        var parent = pids[process.ppid]
        var parent_childs = parent ? parent.childs : godfathers

        parent_childs[process.pid] = process

        return godfathers
      }, {})

      callback(null, result)
    })
  })
}

// export public interface
module.exports = pstree
