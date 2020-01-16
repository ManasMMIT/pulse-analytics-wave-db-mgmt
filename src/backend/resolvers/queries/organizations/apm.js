const { APM_TOOL_ID } = require('../../../global-tool-ids')
const getOrgsAndConnectionsByTool = require('./getOrgsAndConnectionsByTool')

const apmOrganizations = async (
  parent,
  args,
  { pulseCoreDb },
) => getOrgsAndConnectionsByTool({ db: pulseCoreDb, toolId: APM_TOOL_ID })

module.exports = apmOrganizations
