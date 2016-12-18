#!/usr/bin/env node

// Dependencies
const archy = require('archy')
const pstree = require('./lib')

/**
 * Convert pstree data to display it with archy
 * @see     https://www.npmjs.com/package/archy
 * @access  private
 * @param   {Object} data `data` should be a tree of nested objects with
 *                        'label' and 'nodes' fields. 'label' is a string of
 *                        text to display at a node level and 'nodes' is an
 *                        array of the descendents of the current node.
 * @returns {Object}      Return a string representation of obj with unicode
 *                        pipe characters like how npm ls looks.
 */
function pstree2archy(data)
{
  return Object.keys(data).map(function(pid)
  {
    let process = data[pid]

    let result =
    {
      label: process.comm,
      nodes: pstree2archy(process.childs)
    }

    return result
  })
}

// calls pstree function to get a process list
pstree(function(error, result)
{
  if(error) throw error

  // converts the process list to archy
  pstree2archy(result).forEach(function(tree)
  {
    console.log(archy(tree))
  })
})
