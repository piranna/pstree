#!/usr/bin/env node

const archy = require('archy')

const pstree = require('.')


function pid2archy(pid)
{
  const {childs, comm: label} = this[pid]

  return {
    label,
    nodes: pstree2archy(childs)
  }
}


/**
 * Convert pstree data to display it with archy
 *
 * @see https://www.npmjs.com/package/archy
 *
 * @access private
 *
 * @param {Object} data `data` should be a tree of nested objects with 'label'
 *                      and 'nodes' fields. 'label' is a string of text to
 *                      display at a node level and 'nodes' is an array of the
 *                      descendents of the current node.
 *
 * @returns {Object[]} Array of objects following the `archy` scheme.
 */
function pstree2archy(data)
{
  return Object.keys(data).map(pid2archy, data)
}


// calls pstree function to get a process list
pstree()
.then(function(result)
{
  // converts the process list to archy
  for(const tree of pstree2archy(result))
    console.log(archy(tree))
})
