import _ from 'lodash'

export default (nodes) => {
  const nodesById = _.keyBy(nodes, '_id')

  const memo = {}

  for (const node of nodes) {
    const path = getPathString(node, nodesById, memo) + ` (${node.type})`
    node.path = path
  }

  return nodes
}

const getPathString = (node, nodesById, memo) => {
  let path = ''

  if (!node) return path

  if (memo[node._id]) return memo[node._id]

  const parentPath = getPathString(nodesById[node.parentId], nodesById, memo)

  path = parentPath + `/${node.name}`

  memo[node._id] = path

  return path
}
