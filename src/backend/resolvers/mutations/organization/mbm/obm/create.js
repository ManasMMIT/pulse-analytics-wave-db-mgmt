const { MBM_TOOL_ID } = require('../../../../../global-tool-ids')

const createObmAccount = async (
  parent,
  { input },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  let createdObm

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    createdObm = await pulseCoreDb
      .collection('organizations')
      .insertOne(
        {
          ...input,
          type: 'Oncology Benefit Manager',
          toolIds: [MBM_TOOL_ID],
        },
        { session }
      )
      .then(({ ops }) => ops[0])

    const { type, toolIds, ...devObm } = createdObm

    await pulseDevDb.collection('obms').insertOne(devObm, { session })
  })

  return createdObm
}

module.exports = createObmAccount
