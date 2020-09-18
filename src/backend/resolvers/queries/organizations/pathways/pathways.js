const { PATHWAYS_TOOL_ID } = require('../../../../global-tool-ids')
const getOrgsAndConnectionsByTool = require('../getOrgsAndConnectionsByTool')

const pathwaysOrganizations = async (parent, args, { pulseCoreDb }) =>
  getOrgsAndConnectionsByTool({ db: pulseCoreDb, toolId: PATHWAYS_TOOL_ID })

module.exports = pathwaysOrganizations
