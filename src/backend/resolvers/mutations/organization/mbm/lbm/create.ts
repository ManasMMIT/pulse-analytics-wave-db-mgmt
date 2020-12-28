import { MBM_TOOL_ID } from '../../../../../global-tool-ids'

const createLbmOrganization = async (
  parent,
  { input },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  let createdLbm

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    createdLbm = await pulseCoreDb
      .collection('organizations')
      .insertOne(
        {
          ...input,
          type: 'Laboratory Benefit Manager',
          toolIds: [MBM_TOOL_ID],
        },
        { session }
      )
      .then(({ ops }) => ops[0])

    const { type, toolIds, ...devObm } = createdLbm

    await pulseDevDb.collection('lbms').insertOne(devObm, { session })
  })

  return createdLbm
}

export default createLbmOrganization
