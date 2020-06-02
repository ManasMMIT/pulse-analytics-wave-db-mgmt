const { ObjectId } = require('mongodb')

const deleteAquilaConfigField = async (
  parent,
  { input: { _id, aquilaConfigId } },
  { pulseCoreDb }
) => {
  aquilaConfigId = ObjectId(aquilaConfigId)
  _id = ObjectId(_id)

  const { value: originalAquilaConfig } = await pulseCoreDb.collection('businessObjects.aquilaConfigs')
    .findOneAndUpdate(
      { _id: aquilaConfigId },
      { $pull: { fields: { _id } } },
    )

  const deletedField = originalAquilaConfig.fields.find(({ _id: fieldId }) => fieldId.equals(_id))

  return deletedField
}

module.exports = deleteAquilaConfigField
