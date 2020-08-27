const {readFile} = require('fs').promises

const {sscanf} = require('scanf')


const format = '%d (%s) %c %d %d %d %d %d %u %lu %lu %lu %lu %lu %lu %ld %ld '+
               '%ld %ld %ld %ld %llu %lu %ld %lu %lu %lu %lu %lu %lu %lu %lu '+
               '%lu %lu %lu %lu %lu %d %d %u %u %llu %lu %ld %lu %lu %lu %lu '+
               '%lu %lu %lu %d'

const keys = ['pid', 'comm', 'state', 'ppid', 'pgrp', 'session', 'tty_nr',
              'tpgid', 'flags', 'minflt', 'cminflt', 'majflt', 'cmajflt',
              'utime', 'stime', 'cutime', 'cstime', 'priority', 'nice',
              'num_threads', 'itrealvalue','starttime', 'vsize', 'rss',
              'rsslim', 'startcode', 'endcode', 'startstack', 'kstkesp',
              'kstkeip', 'signal', 'blocked', 'sigignore', 'sigcatch', 'wchan',
              'nswap', 'cnswap', 'exit_signal', 'processor', 'rt_priority',
              'policy', 'delayacct_blkio_ticks', 'guest_time', 'cguest_time',
              'start_data', 'end_data', 'start_brk', 'arg_start', 'arg_end',
              'env_start', 'env_end', 'exit_code']


/**
 * Reads the process stats of the given pid
 *
 * @access public
 *
 * @param  {Number} pid The id of the process
 *
 * @return {Promise} object containing the keys showed below in the call of
 *                   `sscanf`
 */
function getProcessStat(pid)
{
 return readFile(`/proc/${pid}/stat`, 'utf8')
 .then(function(data)
 {
   return sscanf(data, format, ...keys)
 })
}


// export public interface
module.exports = getProcessStat
