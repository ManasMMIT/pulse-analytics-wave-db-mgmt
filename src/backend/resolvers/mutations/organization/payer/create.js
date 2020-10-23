const { PAYER_TOOL_ID, MSA_TOOL_ID } = require('./../../../../global-tool-ids')

const createPayerAccount = async (
  parent,
  { input },
  { pulseCoreDb, pulseDevDb, pulseProdDb, mongoClient },
  info
) => {
  const session = mongoClient.startSession()

  let newPayer
  await session.withTransaction(async () => {
    const { ops } = await pulseCoreDb.collection('organizations').insertOne(
      {
        ...input,
        type: 'Payer',
        toolIds: [PAYER_TOOL_ID, MSA_TOOL_ID],
      },
      { session }
    )

    newPayer = ops[0]

    const { type, toolIds, ...devCollectionDoc } = newPayer

    await pulseDevDb
      .collection('payers')
      .insertOne(devCollectionDoc, { session })
  })

  return newPayer
}

module.exports = createPayerAccount
