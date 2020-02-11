const getChildNodes = (nodeId, nodesByParentId) => {
  const children = nodesByParentId[nodeId]
  if (!children) return []

  const result = children.reduce((acc, child) => {
    const grandChildren = getChildNodes(child._id, nodesByParentId)
    acc.push(child, ...grandChildren)

    return acc
  }, [])

  return result
}

module.exports = getChildNodes
