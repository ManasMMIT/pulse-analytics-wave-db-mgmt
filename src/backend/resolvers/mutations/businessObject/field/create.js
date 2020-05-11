const { ObjectId } = require('mongodb')

const createBusinessObjectField = async (
  parent,
  {
    input: {
      businessObjectId,
      field,
    },
  },
  { pulseCoreDb },
  info
) => {
  businessObjectId = ObjectId(businessObjectId)

  const fieldWithId = {
    _id: new ObjectId(),
    ...field,
  }

  const { value: updatedBo } = await pulseCoreDb
    .collection('businessObjects')
    .findOneAndUpdate(
      { _id: businessObjectId },
      {
        $push: {
          'fields': fieldWithId,
        }
      },
      { returnOriginal: false }
    )

  const fieldInDb = updatedBo.fields
    .find(({ _id }) => _id.equals(fieldWithId._id))

  return fieldInDb
}
module.exports = createBusinessObjectField
