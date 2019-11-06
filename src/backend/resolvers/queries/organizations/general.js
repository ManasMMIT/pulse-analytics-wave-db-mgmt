const organizations = (parent, { toolId }, { pulseCoreDb }) => {
  if (toolId) {
    return pulseCoreDb
      .collection('organizations')
      .find({ toolIds: toolId })
      .sort({ organization: 1 })
      .toArray()
  }

  return pulseCoreDb
    .collection('organizations')
    .find()
    .sort({ organization: 1 })
    .toArray()
}

module.exports = organizations
