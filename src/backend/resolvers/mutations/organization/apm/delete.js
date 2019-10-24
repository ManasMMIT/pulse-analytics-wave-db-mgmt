const { ObjectId } = require('mongodb')

const deleteApmOrganization = async (
  parent,
  { input: { _id: stringId } },
  { pulseCoreDb },
  info,
) => {
  const _id = ObjectId(stringId)

  const { value: apmOrganization } = await pulseCoreDb
    .collection('organizations')
    .updateOne(
      { _id },
      {
        $set: {
          toolIds: [],
        }
      }
    )

  return apmOrganization
}

module.exports = deleteApmOrganization
