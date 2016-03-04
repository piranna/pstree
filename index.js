var fs = require('fs')

var map    = require('async').map
var sscanf = require('scanf').sscanf


const format = '%d (%s) %c %d %d %d %d %d %u %lu %lu %lu %lu %lu %lu %ld %ld '+
               '%ld %ld %ld %ld %llu %lu %ld %lu %lu %lu %lu %lu %lu %lu %lu '+
               '%lu %lu %lu %lu %lu %d %d %u %u %llu %lu %ld %lu %lu %lu %lu '+
               '%lu %lu %lu %d'


function filterNumber(number)
{
  return !isNaN(number)
}

function getProcessStat(pid, callback)
{
  fs.readFile('/proc/'+pid+'/stat', 'utf8', function(error, data)
  {
    if(error) return callback(error)

    var result = sscanf(data, format,
        'pid', 'comm', 'state', 'ppid', 'pgrp', 'session', 'tty_nr', 'tpgid',
        'flags', 'minflt', 'cminflt', 'majflt', 'cmajflt', 'utime', 'stime',
        'cutime', 'cstime', 'priority', 'nice', 'num_threads', 'itrealvalue',
        'starttime', 'vsize', 'rss', 'rsslim', 'startcode', 'endcode',
        'startstack', 'kstkesp', 'kstkeip', 'signal', 'blocked', 'sigignore',
        'sigcatch', 'wchan', 'nswap', 'cnswap', 'exit_signal', 'processor',
        'rt_priority', 'policy', 'delayacct_blkio_ticks', 'guest_time',
        'cguest_time', 'start_data', 'end_data', 'start_brk', 'arg_start',
        'arg_end', 'env_start', 'env_end', 'exit_code')

    callback(null, result)
  })
}


function pstree(callback)
{
  fs.readdir('/proc', function(error, files)
  {
    if(error) return callback(error)

    map(files.filter(filterNumber), getProcessStat, function(err, results)
    {
      if(error) return callback(error)

      var pids = results.reduce(function(pids, process)
      {
        pids[process.pid] = process

        process.childs = {}

        process.inspect = function()
        {
          return {comm: process.comm, childs: process.childs}
        }

        return pids
      }, {})

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
