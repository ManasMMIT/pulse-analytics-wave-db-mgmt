const { ObjectId } = require('mongodb')

const deleteOrganization = async (
  parent,
  { input: { _id: stringId } },
  { pulseCoreDb, coreRoles, mongoClient },
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
    // ! Note: After this deletion, we still have to push sitemaps to dev,
    // ! and then dev to prod (thereby dropping and replacing permissions)
    // ! to actually disable the deleted permissions on the live app
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

    // STEP 3: Remove the org's connections' twins
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
  })

  return deletedOrg
}

module.exports = deleteOrganization
