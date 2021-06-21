const axios = require('axios')

const basicOrgDeletionOps = async (
  _id,
  { session, pulseDevDb, pulseCoreDb }
) => {
  const { value } = await pulseCoreDb
    .collection('organizations')
    .findOneAndDelete({ _id }, { session })

  const deletedOrg = value

  // ! Vega Op
  if (deletedOrg.type === 'Provider') {
    await axios.delete(`providers/${deletedOrg.uuid}/`).catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
  }

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
