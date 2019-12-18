const { PAYER_TOOL_ID } = require('../../../global-tool-ids')

const payerOrganizations = async (parent, args, { pulseCoreDb }) => {
  return await pulseCoreDb
    .collection('organizations')
    .find({ toolIds: PAYER_TOOL_ID })
    .collation({ locale: 'en' })
    .sort({ organization: 1 })
    .toArray()
}

module.exports = payerOrganizations
