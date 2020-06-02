const { OBM_TOOL_ID } = require('./../../../../global-tool-ids')

const createObmAccount = async (
  parent,
  { input },
  { pulseCoreDb },
  info,
) => {
  const { ops } = await pulseCoreDb
    .collection('organizations')
    .insertOne({
      ...input,
      type: 'Oncology Benefit Manager',
      toolIds: [OBM_TOOL_ID],
    })

  return ops[0]
}

module.exports = createObmAccount
