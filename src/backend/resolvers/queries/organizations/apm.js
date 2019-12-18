const { APM_TOOL_ID } = require('../../../global-tool-ids')

const apmOrganizations = async (parent, args, { pulseCoreDb }) => {
  return await pulseCoreDb
    .collection('organizations')
    .find({ toolIds: APM_TOOL_ID })
    .collation({ locale: 'en' })
    .sort({ organization: 1 })
    .toArray()
}

module.exports = apmOrganizations
