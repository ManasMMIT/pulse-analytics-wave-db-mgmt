const { PAYER_TOOL_ID } = require('../../../global-tool-ids')
const getOrgsAndConnectionsByTool = require('./getOrgsAndConnectionsByTool')

const payerOrganizations = async (
  parent,
  args,
  { pulseCoreDb }
) => getOrgsAndConnectionsByTool({ db: pulseCoreDb, toolId: PAYER_TOOL_ID })

module.exports = payerOrganizations
