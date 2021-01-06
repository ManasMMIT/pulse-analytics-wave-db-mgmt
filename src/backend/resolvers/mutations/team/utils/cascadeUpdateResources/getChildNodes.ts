interface Node {
  [key: string]: any;
}

const getChildNodes = (nodeId: string, nodesByParentId: Node): Node[] => {
  const children = nodesByParentId[nodeId]
  if (!children) return []

  const result = children.reduce((acc: any, child: any) => {
    const grandChildren = getChildNodes(child._id, nodesByParentId)
    acc.push(child, ...grandChildren)

    return acc
  }, [])

  return result
}

export default getChildNodes
