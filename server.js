#!/usr/bin/env node

var archy = require('archy')

var pstree = require('./lib')


function pstree2archy(data)
{
  return Object.keys(data).map(function(pid)
  {
    var process = data[pid]

    var result =
    {
      label: process.comm,
      nodes: pstree2archy(process.childs)
    }

    return result
  })
}


pstree(function(error, result)
{
  if(error) throw error

  pstree2archy(result).forEach(function(tree)
  {
    console.log(archy(tree))
  })
})
