const _ = require('lodash')

const pathNodes = async (parent, { roleId }, { pulseCoreDb }, info) => {
  if (roleId) {
    const targetRole = await pulseCoreDb.collection('roles')
      .findOne({ _id: roleId })

    const {
      tools,
      dashboards,
      pages,
      cards
    } = targetRole.sitemap

    const flattenedRoleNodes = [...tools, ...dashboards, ...pages, ...cards]
      
    const nodesWithPaths = addPathToNodes(flattenedRoleNodes)

    return nodesWithPaths
  }
  
  const nodes = await pulseCoreDb.collection('nodes')
    .find()
    .sort({ order: 1 })
    .toArray()

  const nodesWithPaths = addPathToNodes(nodes)

  return nodesWithPaths
}

const addPathToNodes = nodes => {
  const nodesById = _.keyBy(nodes, '_id')

  for (const node of nodes) {
    const path = getPathString(node, nodesById) + ` (${node.type})`
    node.path = path
  }

  return nodes
}

const getPathString = (node, nodesById) => {
  let memoPath = ''

  if (!node) return memoPath

  const parentPath = getPathString(
    nodesById[node.parentId],
    nodesById,
  ) 

  memoPath = parentPath + `/${node.name}`

  return memoPath
}

module.exports = pathNodes
