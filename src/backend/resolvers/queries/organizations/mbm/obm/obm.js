const { MBM_TOOL_ID } = require('../../../../../global-tool-ids')

const obmOrganizations = async (parent, args, { pulseCoreDb }) =>
  pulseCoreDb
    .collection('organizations')
    .find({ toolIds: MBM_TOOL_ID })
    .toArray()

module.exports = obmOrganizations
