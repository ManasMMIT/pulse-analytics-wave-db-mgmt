const { ObjectId } = require('mongodb')
const _ = require('lodash')

const {
  PROVIDER_TOOL_ID,
  IMMUNO_TOOL_ID,
  SICKLE_TOOL_ID
} = require('./../../../../global-tool-ids')

const bulkImport = async (
  parent,
  { data },
  { pulseCoreDb, mongoClient, pulseDevDb },
  info,
) => {
  let splitData = []
  while (data.length > 0) {
    splitData.push(data.splice(0, 200))
  }

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // Step 1: Upsert into organizations collection
    const parallelOps = splitData.map(dataSet => {
      const upsertOrgOps = dataSet.map(({ _id, ...org }) => {
        return pulseCoreDb.collection('organizations')
          .updateOne(
            {
              _id: _id ? ObjectId(_id) : new ObjectId(),
              type: 'Provider',
            },
            {
              $set: {
                ...org,
                type: 'Provider',
                toolIds: [
                  PROVIDER_TOOL_ID,
                  IMMUNO_TOOL_ID,
                  SICKLE_TOOL_ID
                ],
              },
            },
            { upsert: true, session }
          )
      })
  
      // Step 2: update orgs in nodes resources
      // const updateNodeResourcesOps = dataSet.map(({ _id, slug }) => {
      //   return pulseDevDb.collection('users.nodes.resources')
      //     .updateMany(
      //       { 'resources.accounts._id': _id ? ObjectId(_id) : null },
      //       {
      //         $set: {
      //           'resources.$[resource].accounts.$[el].slug': slug,
      //         }
      //       },
      //       {
      //         arrayFilters: [
      //           { 'resource.accounts': { $exists: true } },
      //           { 'el._id': _id ? ObjectId(_id) : null }
      //         ],
      //         session,
      //       }
      //     )
      // })
  
      // Step 3: update provider's connection state
      const updateConnectionAffiliatedStateOps = dataSet.map(({ _id, state }) => {
        return pulseCoreDb.collection('organizations.connections')
          .updateMany(
            { orgs: _id ? ObjectId(_id) : null },
            { $set: { state } },
            { session }
          )
      })
  
      // Step 4: update each provider's newProviders docs
      const updateProvidersCollectionOps = dataSet.map(async org => {
        // ? connectionIds correspond to newProviders _ids
        const connectionDocs = await pulseCoreDb
          .collection('organizations.connections')
          .find(
            { orgs: org._id ? ObjectId(org._id) : null },
          )
          .toArray()
        
        const connectionIds = connectionDocs.map(({ _id }) => _id)
  
        return pulseDevDb.collection('newProviders')
          .updateMany(
            { _id: { $in: connectionIds } },
            {
              $set: {
                provider: org.organization,
                slugProvider: org.slug,
                state: org.state,
                oncologists: org.oncologistsCount,
                sites: org.sitesCount,
              }
            },
            { session }
          )
      })
  
      return Promise.all([
        ...upsertOrgOps,
        // ...updateNodeResourcesOps,
        ...updateConnectionAffiliatedStateOps,
        ...updateProvidersCollectionOps,
      ])
    })

    await Promise.all(parallelOps)
  })

  return 'Import Successful'
}

module.exports = bulkImport
