const { ObjectId } = require('mongodb')

const deletePerson = async (
  parent,
  { input: { _id } },
  { mongoClient, pulseCoreDb, pulseDevDb },
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
      .collection('JOIN_obms_people')
      .deleteMany({ personId: _id }, { session })

    // Step 3: Cascade delete JOIN entries connected to person in pulse-dev.obmsInfluencers
    await pulseDevDb
      .collection('obmsInfluencers')
      .deleteMany({ 'person._id': _id }, { session })
  })

  return result
}

module.exports = deletePerson
