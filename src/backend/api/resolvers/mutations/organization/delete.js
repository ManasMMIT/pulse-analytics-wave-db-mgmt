const { ObjectId } = require('mongodb')

const deleteOrganization = async (
  parent,
  { input: { _id: stringId } },
  { pulseDevDb, pulseCoreDb, coreRoles, mongoClient },
  info,
) => {
  const _id = ObjectId(stringId)

  const session = mongoClient.startSession()

  let deletedOrg

  await session.withTransaction(async () => {
    // STEP 1: delete the org from organizations collection
    const { value } = await pulseCoreDb
      .collection('organizations')
      .findOneAndDelete(
        { _id },
        { session },
      )

    deletedOrg = value

    // STEP 2: Delete the org across all teams' resources' accounts
    // ! Note: After this deletion, we still have to push dev to prod 
    // ! (thereby dropping and replacing permissions) to actually 
    // ! disable the deleted permissions on the live app
    await coreRoles.updateMany(
      {
        'resources.accounts._id': _id,
      },
      {
        $pull: {
          'resources.$[].accounts': { _id }
        }
      },
      { session },
    )

    const connectionIds = (deletedOrg.connections || [])
      .map(({ _id }) => _id)

    // ! STEP 3: TO DEPRECATE: Remove the org's connections' twins
    await pulseCoreDb
      .collection('organizations')
      .updateMany(
        {
          'connections._id': { $in: connectionIds },
        },
        {
          $pull: {
            connections: {
              _id: { $in: connectionIds }
            },
          }
        },
        { session },
      )

    // STEP 4: Remove the org from pulse-core connections and pulse-dev providers collection
    const connectionDocs = await pulseCoreDb
        .collection('organizations.connections')
        .find(
          { orgs: _id },
          { session },
        )
        .toArray()

    const connectionIdsToRemove = connectionDocs.map(({ _id }) => _id)

    // if one or more connections targeted for deletion are between a payer and a VBM,
    // that's fine because those deletion ops will merely do nothing to the
    // providers collection in dev (since that only has provider/VBM connections)
    await pulseDevDb
      .collection('newProviders')
      .deleteMany(
        { _id: { $in: connectionIdsToRemove } },
        { session },
      )
    
    await pulseCoreDb
      .collection('organizations.connections')
      .deleteMany(
        { orgs: _id },
        { session },
      )
  })

  return deletedOrg
}

module.exports = deleteOrganization
