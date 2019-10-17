const { PROVIDER_TOOL_ID } = require('./../../../../global-tool-ids')

const createProviderOrganization = async (
  parent,
  { input },
  { pulseCoreDb },
  info,
) => {
  const { ops } = await pulseCoreDb
    .collection('organizations')
    .insertOne({
      ...input,
      toolIds: [PROVIDER_TOOL_ID],
    })

  return ops[0]
}

module.exports = createProviderOrganization
