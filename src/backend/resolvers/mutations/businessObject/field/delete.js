const { ObjectId } = require('mongodb')

const deleteBusinessObjectField = async (
  parent,
  {
    input: {
      businessObjectId,
      fieldId,
    },
  },
  { pulseCoreDb, mongoClient },
  info
) => {
  businessObjectId = ObjectId(businessObjectId)
  fieldId = ObjectId(fieldId)

  const session = mongoClient.startSession()

  let result
  await session.withTransaction(async () => {
    // Step 1: Null businessObjRef in workbooksConfig for any removed fields.
    await pulseCoreDb.collection('workbooksConfig')
      .updateMany(
        {
          'sheets.fields.businessObjRef._id': businessObjectId,
        },
        {
          $set: {
            'sheets.$[sheet].fields.$[field].businessObjRef': null
          }
        },
        {
          session,
          arrayFilters: [
            {
              'sheet.fields': { $exists: true }
            },
            {
              'field.businessObjRef': { $exists: true },
              'field.businessObjRef._id': businessObjectId,
              'field.businessObjRef.fieldId': fieldId,
            },
          ]
        }
      )
    // Step 2: Pull Field from Business Object
    const { value: { fields: oldFields } } = await pulseCoreDb
      .collection('businessObjects')
      .findOneAndUpdate(
        { _id: businessObjectId },
        {
          $pull: { fields: { _id: fieldId } }
        },
        { session }
      )

    result = oldFields.find(({ _id }) => _id.equals(fieldId))
  })

  return result
}

module.exports = deleteBusinessObjectField
