const organizations = async (parent, { toolId }, { pulseCoreDb }) => {
  return await pulseCoreDb
    .collection('organizations')
    .find({ toolIds: toolId })
    .sort({ organization: 1 })
    .toArray()
}

module.exports = organizations
