const { ObjectId } = require('mongodb')

const deleteBusinessObject = async (
  parent,
  {
    input: { _id },
  },
  { pulseCoreDb, mongoClient },
  info,
) => {
  _id = ObjectId(_id)

  const session = mongoClient.startSession()

  let result
  await session.withTransaction(async () => {
    // Step 1: Remove any Business Object Refs from `workbooksConfig` collection
    await pulseCoreDb.collection('workbooksConfig')
      .updateMany(
        {
          'sheets.fields.businessObjRef._id': _id,
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
              'field.businessObjRef._id': _id,
            },
          ]
        }
      )

    // Step 2: Delete Business Object
    result = await pulseCoreDb
      .collection('businessObjects')
      .findOneAndDelete({ _id }, { session })
      .then(({ value }) => value)
  })

  return result
}

module.exports = deleteBusinessObject
