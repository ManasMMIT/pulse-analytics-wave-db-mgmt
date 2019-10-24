const { ObjectId } = require('mongodb')

const deletePathwaysOrganization = async (
  parent,
  { input: { _id: stringId } },
  { pulseCoreDb },
  info,
) => {
  const _id = ObjectId(stringId)

  const { value: pathwaysOrganization } = await pulseCoreDb
    .collection('organizations')
    .updateOne(
      { _id },
      {
        $set: {
          toolIds: [],
        }
      }
    )

  return pathwaysOrganization
}

module.exports = deletePathwaysOrganization
