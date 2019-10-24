const { ObjectId } = require('mongodb')

const deleteProviderOrganization = async (
  parent,
  { input: { _id: stringId } },
  { pulseCoreDb },
  info,
) => {
  const _id = ObjectId(stringId)

  const { value: providerAccount } = await pulseCoreDb
    .collection('organizations')
    .updateOne(
      { _id },
      {
        $set: {
          toolIds: [],
        }
      }
    )

  return providerAccount
}

module.exports = deleteProviderOrganization
