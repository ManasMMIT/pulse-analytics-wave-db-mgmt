const { ObjectId } = require('mongodb')

const updateBusinessObjectField = async (
  parent,
  {
    input: {
      businessObjectId,
      field: {
        _id: fieldId,
        type,
        key
      },
    },
  },
  { pulseCoreDb },
  info
) => {
  // ! Shared field TypeDef between create and update resolvers,
    // ! so graphql doesn't require this field
  if (!fieldId) {
    throw new Error('Invalid field ID')
  }

  businessObjectId = ObjectId(businessObjectId)
  fieldId = ObjectId(fieldId)

  const { value: updatedBo } = await pulseCoreDb
    .collection('businessObjects')
    .findOneAndUpdate(
      { _id: businessObjectId },
      {
        $set: {
          'fields.$[field]': {
            _id: fieldId,
            type,
            key,
          },
        }
      },
      {
        arrayFilters: [
          { 'field._id': fieldId }
        ],
        returnOriginal: false,
      }
    )

  return updatedBo.fields.find(({ _id }) => _id.equals(fieldId))
}

module.exports = updateBusinessObjectField
