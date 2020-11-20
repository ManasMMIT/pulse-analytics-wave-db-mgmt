const basicOrgDeletionOps = async (
  _id,
  { session, pulseDevDb, pulseCoreDb }
) => {
  const { value } = await pulseCoreDb
    .collection('organizations')
    .findOneAndDelete({ _id }, { session })

  const deletedOrg = value

  await pulseCoreDb.collection('roles').updateMany(
    {
      'resources.accounts._id': _id,
    },
    {
      $pull: {
        'resources.$[].accounts': { _id },
      },
    },
    { session }
  )

  await pulseDevDb.collection('users.nodes.resources').updateMany(
    {
      'resources.accounts._id': _id,
    },
    {
      $pull: {
        'resources.$[].accounts': { _id },
      },
    },
    { session }
  )

  return deletedOrg
}

module.exports = basicOrgDeletionOps
