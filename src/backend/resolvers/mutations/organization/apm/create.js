const { APM_TOOL_ID } = require('./../../../../global-tool-ids')

const createApmAccount = async (
  parent,
  { input },
  { pulseCoreDb },
  info,
) => {
  const { ops } = await pulseCoreDb
    .collection('organizations')
    .insertOne({
      ...input,
      type: 'Alternative Payment Model',
      toolIds: [APM_TOOL_ID],
    })

  return ops[0]
}

module.exports = createApmAccount
