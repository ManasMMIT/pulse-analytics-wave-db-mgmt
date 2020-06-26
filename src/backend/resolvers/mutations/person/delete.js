const { ObjectId } = require('mongodb')

const deletePerson = async (
  parent,
  { input: { _id } },
  { mongoClient, pulseCoreDb },
  info
) => {
  _id = ObjectId(_id)

  let result

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // Step 1: Delete person from own collection
    const { value } = await pulseCoreDb
      .collection('people')
      .findOneAndDelete({ _id }, { session })

    result = value

    // Step 2: Cascade delete person if an obm influencer
    await pulseCoreDb
      .collection('obm_people')
      .deleteMany({ personId: _id }, { session })
  })

  return result
}

module.exports = deletePerson
