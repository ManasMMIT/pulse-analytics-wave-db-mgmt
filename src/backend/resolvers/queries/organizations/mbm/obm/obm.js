const { MBM_TOOL_ID } = require('../../../../../global-tool-ids')

const obmOrganizations = async (parent, args, { pulseCoreDb }) =>
  pulseCoreDb
    .collection('organizations')
    .find({ toolIds: MBM_TOOL_ID, type: 'Oncology Benefit Manager' })
    .toArray()

module.exports = obmOrganizations
