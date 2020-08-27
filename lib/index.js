const {readdir} = require('fs').promises

const getProcessStat = require('./getProcessStat')


/**
 * Checks if the number is `NaN` (Not a Number)
 *
 * @access private
 *
 * @param {Number} number The number will be checked if its a `NaN`
 *
 * @return {Boolean} Returns `true` if the number is `NaN`
 */
function filterNumber(number)
{
  return !isNaN(number)
}

/**
 * This callback creates a empty object on every `process.child`
 *
 * @param {Object} pids    This object holds every process with the `pid` as
 *                         key
 * @param {Object} process The process object
 *
 * @return {Object} Returns a object
 */
function reducePids(pids, process)
{
  pids[process.pid] = process

  process.childs = {}

  return pids
}


/**
 * Reads the `/proc` directory and maps the processes
 *
 * @return {Promise}
 */
function pstree()
{
  return readdir('/proc')
  .then(function(files)
  {
    return Promise.all(files.filter(filterNumber).map(getProcessStat))
  })
  .then(function(results)
  {
    const pids = results.reduce(reducePids, {})

    return results.reduce(function(godfathers, process)
    {
      const parent = pids[process.ppid]
      const parent_childs = parent ? parent.childs : godfathers

      parent_childs[process.pid] = process

      return godfathers
    }, {})
  })
}


// export public interface
module.exports = pstree
