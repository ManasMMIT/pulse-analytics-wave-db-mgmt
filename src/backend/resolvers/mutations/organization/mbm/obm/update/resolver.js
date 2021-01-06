const { ObjectId } = require('mongodb')

const cascadePolicyUpdate = require('../../../../utils/cascadePolicyUpdate')
const getCascadePolicy = require('./getCascadePolicy')

const updateObmOrganization = async (
  parent,
  { input: { _id, ...body } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  _id = ObjectId(_id)

  const session = mongoClient.startSession()

  let result
  await session.withTransaction(async () => {
    const { value } = await pulseCoreDb
      .collection('organizations')
      .findOneAndUpdate(
        { _id },
        { $set: body },
        { returnOriginal: false, session }
      )

    result = value

    const cascadePolicy = getCascadePolicy({
      input: result,
      pulseDevDb,
      session,
    })

    await Promise.all(cascadePolicy.map(cascadePolicyUpdate))
  })

  return result
}

module.exports = updateObmOrganization
