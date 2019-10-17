const { ObjectId } = require('mongodb')
const { APM_TOOL_ID } = require('./../../../../global-tool-ids')

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
        $pull: {
          toolIds: APM_TOOL_ID,
        }
      }
    )

  return apmOrganization
}

module.exports = deleteApmOrganization
