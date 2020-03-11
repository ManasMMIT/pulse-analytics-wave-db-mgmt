const {
  PAYER_TOOL_ID,
  MSA_TOOL_ID,
} = require('./../../../../global-tool-ids')

const createPayerAccount = async (
  parent,
  { input },
  { pulseCoreDb },
  info,
) => {
  const { ops } = await pulseCoreDb
    .collection('organizations')
    .insertOne({
      ...input,
      type: 'Payer',
      toolIds: [PAYER_TOOL_ID, MSA_TOOL_ID],
    })

  return ops[0]
}

module.exports = createPayerAccount
