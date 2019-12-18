const { PATHWAYS_TOOL_ID } = require('../../../global-tool-ids')

const pathwaysOrganizations = async (parent, args, { pulseCoreDb }) => {
  return await pulseCoreDb
    .collection('organizations')
    .find({ toolIds: PATHWAYS_TOOL_ID })
    .collation({ locale: 'en' })
    .sort({ organization: 1 })
    .toArray()
}

module.exports = pathwaysOrganizations
