const { OBM_TOOL_ID } = require('../../../../global-tool-ids')

const obmOrganizations = async (
  parent,
  args,
  { pulseCoreDb },
) => pulseCoreDb.collection('organizations')
  .find({ toolIds: OBM_TOOL_ID })
  .toArray()

module.exports = obmOrganizations
