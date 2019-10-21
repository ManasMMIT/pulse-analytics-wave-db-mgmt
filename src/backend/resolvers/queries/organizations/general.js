const organizations = async (parent, { toolId }, { pulseCoreDb }) => {
  return await pulseCoreDb
    .collection('organizations')
    .find({ toolIds: toolId })
    .toArray()
}

module.exports = organizations
