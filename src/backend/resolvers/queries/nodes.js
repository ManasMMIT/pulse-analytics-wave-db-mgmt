const nodes = (parent, { parentId, type }, { pulseCoreDb }, info) => {
  let queryObj = {}
  if (parentId) queryObj.parentId = parentId
  if (type) queryObj.type = type

  return pulseCoreDb.collection('nodes')
    .find(queryObj)
    .sort({ order: 1 })
    .toArray()
}

module.exports = nodes
