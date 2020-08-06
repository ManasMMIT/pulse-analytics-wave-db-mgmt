const { ObjectId } = require('mongodb')
const getIndTherapeuticAreaPipeline = require('./getIndTherapeuticAreaPipeline')

const createIndication = async (
  parent,
  { input: { name, regimens = [], therapeuticAreaId } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  therapeuticAreaId = ObjectId(therapeuticAreaId)

  const session = mongoClient.startSession()

  let newIndication

  await session.withTransaction(async () => {
    // Step 1: Create the indication
    newIndication = await pulseCoreDb
      .collection('indications')
      .insertOne(
        {
          name,
          regimens,
          therapeuticAreaId,
        },
        { session }
      )
      .then((res) => res.ops[0])

    // Step 2: Materialize new indication/therapeuticArea combo doc and insert it into
    // pulse-dev.indicationsTherapeuticAreas collection
    const docToInsert = await pulseCoreDb
      .collection('indications')
      .aggregate(getIndTherapeuticAreaPipeline(newIndication._id), { session })
      .next()

    await pulseDevDb
      .collection('indicationsTherapeuticAreas')
      .insertOne(docToInsert, { session })
  })

  return newIndication
}

module.exports = createIndication
