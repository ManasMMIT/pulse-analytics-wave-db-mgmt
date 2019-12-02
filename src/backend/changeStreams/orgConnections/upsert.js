const upsertConnection = async ({
  mongoClient,
  fullDocument,
  organizationsCollection,
  toolIdsMap,
}) => {
  const {
    _id,
    slug,
    slugType,
    affiliationType,
    slug1,
    slugType1,
    state,
  } = fullDocument

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // STEP 1: Remove the existing connection in the organizations collection
    // ! Note: For insertion, there's nothing to $pull since the connection
    // ! doesn't exist yet. This step only applies to update.
    await organizationsCollection.updateMany(
      { connections: { $elemMatch: { _id } } },
      { $pull: { connections: { _id } } },
      { session },
    )

    // STEP 2: Insert the connection everywhere it's needed.

    // STEP 2a: Get the organization objects without connections slice.
    // ! Note: There eventually shouldn't be more than one organization for
    // ! a given SLUG and TYPE (provider, payer, pathways), but right now
    // ! there are dupes, so the logic takes that into account by using #find
    // ! instead of #findOne.
    const orgsArr1 = await organizationsCollection.find(
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
    ).toArray()

    const orgsArr2 = await organizationsCollection.find(
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
    ).toArray()

    // STEP 2b: Depending on which org is what type, set up what
    // kind of connection object to add to each and persist.
    // ! Note HACK: Logic below is very specific to VBM participation's seed data.
    // ! If orgsArr1 are (pathways or apm), then orgsArr2 must be (provider or payer);
    // ! If orgsArr1 are (provider or payer), then orgsArr2 must be (pathways or apm).
    if (
      slugType === 'Pathways'
      || slugType === 'Alternative Payment Model'
    ) {
      // ! Note: There are only dupes in the DB for provider and payer right now, so
      // ! we only iterate over orgsArr2 and persist bilateral connections for each dupe
      for (const providerOrPayerOrg of orgsArr2) {
        const connectionObjToAddToOrg1 = {
          _id,
          org: providerOrPayerOrg,
          category: 'Value-Based Model Participation',
          type: 'affiliated_with',
        }

        const connectionObjToAddToOrg2 = {
          _id,
          org: orgsArr1[0],
          category: 'Value-Based Model Participation',
          type: 'participates_in',
          state,
          affiliationType, // this field is on this side only because it's only relevant when looking from provider/payer perspective
        }

        await Promise.all([
          organizationsCollection.updateOne(
            {
              _id: orgsArr1[0]._id,
            },
            {
              $push: { connections: connectionObjToAddToOrg1 }
            },
            { session },
          ),
          organizationsCollection.updateOne(
            {
              _id: providerOrPayerOrg._id
            },
            {
              $push: { connections: connectionObjToAddToOrg2 }
            },
            { session },
          )
        ])
      }
    } else {
      // ! Note: This section is untested, put here in case it's not always pathways/apm on the left side
      // ! and providers/payers on the right side of the raw seed data sheet.
      for (const providerOrPayerOrg of orgsArr1) {
        const connectionObjToAddToOrg1 = {
          _id,
          org: orgsArr2[0],
          category: 'Value-Based Model Participation',
          type: 'participates_in',
          state,
          affiliationType,
        }

        const connectionObjToAddToOrg2 = {
          _id,
          org: providerOrPayerOrg,
          category: 'Value-Based Model Participation',
          type: 'affiliated_with',
        }

        await Promise.all([
          organizationsCollection.updateOne(
            {
              _id: orgsArr2[0]._id,
            },
            {
              $push: { connections: connectionObjToAddToOrg2 }
            },
            { session },
          ),
          organizationsCollection.updateOne(
            {
              _id: providerOrPayerOrg._id
            },
            {
              $push: { connections: connectionObjToAddToOrg1 }
            },
            { session },
          )
        ])
      }
    }
  })
}

module.exports = upsertConnection
