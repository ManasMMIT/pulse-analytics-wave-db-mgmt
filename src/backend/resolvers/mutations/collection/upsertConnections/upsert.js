const upsertConnection = async ({
  fullDocument,
  organizationsCollection,
  toolIdsMap,
  mongoClient,
}) => {
  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    const {
      _id,
      slug,
      slugType,
      affiliationType,
      slug1,
      slugType1,
      state,
    } = fullDocument

    // STEP 1: Remove the existing connection in the organizations collection
    // ! Note: For insertion, there's nothing to $pull since the connection
    // ! doesn't exist yet. This step only applies to update.
    await organizationsCollection.updateMany(
      { 'connections._id': _id },
      { $pull: { connections: { _id } } },
      { session },
    )

    // STEP 2: Insert the connection everywhere it's needed.

    // STEP 2a: Get the organization objects without connections slice.
    const [
      org1,
      org2,
    ] = await Promise.all([
      organizationsCollection.findOne(
        {
          slug,
          toolIds: toolIdsMap[slugType],
        },
        {
          session,
          projection: {
            connections: 0,
          }
        },
      ),
      organizationsCollection.findOne(
        {
          slug: slug1,
          toolIds: toolIdsMap[slugType1],
        },
        {
          session,
          projection: {
            connections: 0,
          }
        },
      ),
    ])

    // STEP 2b: Depending on which org is what type, set up what
    // kind of connection object to add to each and persist.
    // ! Note HACK: Logic below is very specific to VBM participation's seed data.
    // ! If org1 is (pathways or apm), then org2 must be (provider or payer);
    // ! If org2 is (provider or payer), then org1 must be (pathways or apm).

    const promisesArr = []

    if (
      slugType === 'Pathways'
      || slugType === 'Alternative Payment Model'
    ) {
      const connectionObjToAddToOrg1 = {
        _id,
        org: org2,
        category: 'Value-Based Model Participation',
        type: 'affiliated_with',
        state,
        affiliationType,
      }

      const connectionObjToAddToOrg2 = {
        _id,
        org: org1,
        category: 'Value-Based Model Participation',
        type: 'participates_in',
        state,
        affiliationType,
      }

      promisesArr.push(
        organizationsCollection.updateOne(
          {
            _id: org1._id,
          },
          {
            $push: { connections: connectionObjToAddToOrg1 }
          },
          { session },
        ),
        organizationsCollection.updateOne(
          {
            _id: org2._id
          },
          {
            $push: { connections: connectionObjToAddToOrg2 }
          },
          { session },
        )
      )
    } else {
      const connectionObjToAddToOrg1 = {
        _id,
        org: org2,
        category: 'Value-Based Model Participation',
        type: 'participates_in',
        state,
        affiliationType,
      }

      const connectionObjToAddToOrg2 = {
        _id,
        org: org1,
        category: 'Value-Based Model Participation',
        type: 'affiliated_with',
        state,
        affiliationType,
      }

      promisesArr.push(
        organizationsCollection.updateOne(
          {
            _id: org2._id,
          },
          {
            $push: { connections: connectionObjToAddToOrg2 }
          },
          { session },
        ),
        organizationsCollection.updateOne(
          {
            _id: org1._id
          },
          {
            $push: { connections: connectionObjToAddToOrg1 }
          },
          { session },
        )
      )
    }

    await Promise.all(promisesArr)
  })

  return fullDocument
}

module.exports = upsertConnection
