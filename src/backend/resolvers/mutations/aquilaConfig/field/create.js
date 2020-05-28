const { ObjectId } = require('mongodb')

const createAquilaConfigField = async (
  parent,
  { input: { label, aquilaConfigId, boFieldId, inputProps } },
  { pulseCoreDb }
) => {
  aquilaConfigId = ObjectId(aquilaConfigId)
  boFieldId = ObjectId(boFieldId)

  inputProps = JSON.parse(inputProps)

  const newFieldId = ObjectId()

  // Need to first check if field already exists with incoming boFieldId; can't guarantee intra-subarray uniqueness
  // See https://stackoverflow.com/questions/10383143/how-to-ensure-unique-item-in-an-array-based-on-specific-fields-mongodb
  const aquilaConfig = await pulseCoreDb.collection('businessObjects.aquilaConfigs')
    .findOne({ _id: aquilaConfigId })
  
  const isIncomingBoFieldDupe = aquilaConfig.fields.find(
    ({ boFieldId: localBoFieldId }) => localBoFieldId.equals(boFieldId)
  )

  if (isIncomingBoFieldDupe) {
    throw new Error('A field already exists that\'s affiliated with that business object')
  }

  const { value: updatedAquilaConfig } = await pulseCoreDb.collection('businessObjects.aquilaConfigs')
    .findOneAndUpdate(
      { _id: aquilaConfigId },
      {
        $push: {
          fields: {
            _id: newFieldId,
            boFieldId,
            label,
            inputProps,
          }
        }
      },
      {
        returnOriginal: false,
      }
    )

  const newField = updatedAquilaConfig.fields.find(({ _id }) => _id.equals(newFieldId))

  return newField
}

module.exports = createAquilaConfigField
