const { ObjectId } = require('mongodb')

const updatePerson = async (
  parent,
  { input: { _id, ...body } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  const session = mongoClient.startSession()

  let updatedPerson

  await session.withTransaction(async () => {
    const updatedOn = new Date()

    // Step 1: Update core person
    updatedPerson = await pulseCoreDb
      .collection('people')
      .findOneAndUpdate(
        { _id: ObjectId(_id) },
        {
          $set: {
            ...body,
            updatedOn,
          },
        },
        { returnOriginal: false, session }
      )
      .then(({ value }) => value)

    // Step 2: Cascade update pulse-dev.obmsInfluencers
    await pulseDevDb.collection('obmsInfluencers').updateMany(
      { 'person._id': updatedPerson._id },
      {
        $set: {
          'person.firstName': updatedPerson.firstName,
          'person.lastName': updatedPerson.lastName,
          'person.nationalProviderIdentifier':
            updatedPerson.nationalProviderIdentifier,
        },
      },
      { session }
    )
  })

  return updatedPerson
}

module.exports = updatePerson
