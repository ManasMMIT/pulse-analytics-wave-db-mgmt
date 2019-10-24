const { ObjectId } = require('mongodb')

const deletePayerOrganization = async (
  parent,
  { input: { _id: stringId } },
  { pulseCoreDb },
  info,
) => {
  const _id = ObjectId(stringId)

  const { value: payerOrganization } = await pulseCoreDb
    .collection('organizations')
    .updateOne(
      { _id },
      {
        $set: {
          toolIds: [],
        }
      }
    )

  return payerOrganization
}

module.exports = deletePayerOrganization
