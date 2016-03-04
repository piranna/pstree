var readdir = require('fs').readdir

var map = require('async').map

var getProcessStat = require('./getProcessStat')


function filterNumber(number)
{
  return !isNaN(number)
}

function reducePids(pids, process)
{
  pids[process.pid] = process

  process.childs = {}

  return pids
}


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


module.exports = pstree
