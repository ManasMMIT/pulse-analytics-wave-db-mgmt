import _ from 'lodash'

export default nodes => {
  const nodesCopy = _.cloneDeep(nodes)
  const nodesById = _.keyBy(nodesCopy, '_id')

  const memo = {}

  for (const node of nodesCopy) {
    const path = getPathString(node, nodesById, memo) + ` (${node.type})`
    node.path = path
  }

  return nodesCopy
}

const getPathString = (node, nodesById, memo) => {
  let path = ''

  if (!node) return path

  if (memo[node._id]) return memo[node._id]

  const parentPath = getPathString(
    nodesById[node.parentId],
    nodesById,
    memo,
  )

  path = parentPath + `/${node.name}`

  memo[node._id] = path

  return path
}
