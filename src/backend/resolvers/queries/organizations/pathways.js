const { PATHWAYS_TOOL_ID } = require('../../../global-tool-ids')

const pathwaysOrganizations = async (parent, args, { pulseCoreDb }) => {
  return await pulseCoreDb
    .collection('organizations')
    .find({ toolIds: PATHWAYS_TOOL_ID })
    .toArray()
}

module.exports = pathwaysOrganizations
