const { ObjectId } = require('mongodb')
const { PROVIDER_TOOL_ID } = require('./../../../../global-tool-ids')

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
        $pull: {
          toolIds: PROVIDER_TOOL_ID,
        }
      }
    )

  return providerAccount
}

module.exports = deleteProviderOrganization
