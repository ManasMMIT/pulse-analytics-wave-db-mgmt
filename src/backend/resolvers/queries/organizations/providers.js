const { PROVIDER_TOOL_ID } = require('../../../global-tool-ids')

const providerOrganizations = async (parent, args, { pulseCoreDb }) => {
  return await pulseCoreDb
    .collection('organizations')
    .find({ toolIds: PROVIDER_TOOL_ID })
    .collation({ locale: 'en' })
    .sort({ organization: 1 })
    .toArray()
}

module.exports = providerOrganizations
