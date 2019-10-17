const { PROVIDER_TOOL_ID } = require('../../../global-tool-ids')

const providerOrganizations = async (parent, args, { pulseCoreDb }) => {
  return await pulseCoreDb
    .collection('organizations')
    .find({ toolIds: PROVIDER_TOOL_ID })
    .toArray()
}

module.exports = providerOrganizations
