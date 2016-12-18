'use strict'

// Dependencies
const readFile = require('fs').readFile
const sscanf = require('scanf').sscanf

const format = '%d (%s) %c %d %d %d %d %d %u %lu %lu %lu %lu %lu %lu %ld %ld '+
               '%ld %ld %ld %ld %llu %lu %ld %lu %lu %lu %lu %lu %lu %lu %lu '+
               '%lu %lu %lu %lu %lu %d %d %u %u %llu %lu %ld %lu %lu %lu %lu '+
               '%lu %lu %lu %d'

/**
 * Reads the process stats of the given pid
 * @access public
 * @param  {Number}   pid      The id of the process
 * @param  {Function} callback The callback gets called with a object containing
 *                             the keys showed below in the call of `sscanf`
 * @return {Function}          Returns the callback with either an error
 *                             or an object containing the keys from below
 */
function getProcessStat(pid, callback)
{
 readFile(`/proc/${pid}/stat`, 'utf8', function(error, data)
 {
   if(error) return callback(error)

   let result = sscanf(data, format,
       'pid', 'comm', 'state', 'ppid', 'pgrp', 'session', 'tty_nr', 'tpgid',
       'flags', 'minflt', 'cminflt', 'majflt', 'cmajflt', 'utime', 'stime',
       'cutime', 'cstime', 'priority', 'nice', 'num_threads', 'itrealvalue',
       'starttime', 'vsize', 'rss', 'rsslim', 'startcode', 'endcode',
       'startstack', 'kstkesp', 'kstkeip', 'signal', 'blocked', 'sigignore',
       'sigcatch', 'wchan', 'nswap', 'cnswap', 'exit_signal', 'processor',
       'rt_priority', 'policy', 'delayacct_blkio_ticks', 'guest_time',
       'cguest_time', 'start_data', 'end_data', 'start_brk', 'arg_start',
       'arg_end', 'env_start', 'env_end', 'exit_code')

   return callback(null, result)
 })
}

// export public interface
module.exports = getProcessStat
