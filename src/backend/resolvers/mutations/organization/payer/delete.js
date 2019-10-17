const { ObjectId } = require('mongodb')
const { PAYER_TOOL_ID } = require('./../../../../global-tool-ids')

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
        $pull: {
          toolIds: PAYER_TOOL_ID,
        }
      }
    )

  return payerOrganization
}

module.exports = deletePayerOrganization
