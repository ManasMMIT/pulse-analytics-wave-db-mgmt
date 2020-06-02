const { ObjectId } = require('mongodb')

const updateAquilaConfigField = async (
  parent,
  { input: { _id, label, aquilaConfigId, inputProps } },
  { pulseCoreDb }
) => {
  aquilaConfigId = ObjectId(aquilaConfigId)
  _id = ObjectId(_id)

  inputProps = JSON.parse(inputProps)

  const { value: updatedAquilaConfig } = await pulseCoreDb.collection('businessObjects.aquilaConfigs')
    .findOneAndUpdate(
      { _id: aquilaConfigId, 'fields._id': _id },
      {
        $set: {
          'fields.$.label': label,
          'fields.$.inputProps': inputProps,
        },
      },
      {
        returnOriginal: false,
      }
    )

  const updatedField = updatedAquilaConfig.fields.find(({ _id: fieldId }) => fieldId.equals(_id))

  return updatedField
}

module.exports = updateAquilaConfigField
