const { ObjectId } = require('mongodb')
const { PATHWAYS_TOOL_ID } = require('./../../../../global-tool-ids')

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
        $pull: {
          toolIds: PATHWAYS_TOOL_ID,
        }
      }
    )

  return pathwaysOrganization
}

module.exports = deletePathwaysOrganization
