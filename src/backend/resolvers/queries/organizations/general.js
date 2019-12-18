const organizations = (parent, { toolId }, { pulseCoreDb }) => {
  if (toolId) {
    return pulseCoreDb
      .collection('organizations')
      .find({ toolIds: toolId })
      .collation({ locale: 'en' })
      .sort({ organization: 1 })
      .toArray()
  }

  return pulseCoreDb
    .collection('organizations')
    .find()
    .collation({ locale: 'en' })
    .sort({ organization: 1 })
    .toArray()
}

module.exports = organizations
