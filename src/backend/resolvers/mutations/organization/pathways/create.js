const { PATHWAYS_TOOL_ID } = require('./../../../../global-tool-ids')

const createPathwaysAccount = async (
  parent,
  { input },
  { pulseCoreDb },
  info,
) => {
  const { ops } = await pulseCoreDb
    .collection('organizations')
    .insertOne({
      ...input,
      toolIds: [PATHWAYS_TOOL_ID],
    })

  return ops[0]
}

module.exports = createPathwaysAccount
