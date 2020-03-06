const { ObjectId } = require('mongodb')

const updateSheetField = async (
  parent,
  { input: { workbookId, sheetId, fieldId, ...body } },
  { pulseCoreDb }
) => {
  workbookId = ObjectId(workbookId)
  sheetId = ObjectId(sheetId)
  fieldId = ObjectId(fieldId)

  const { value } = await pulseCoreDb.collection('workbooksConfig')
    .findOneAndUpdate(
      { _id: workbookId },
      {
        $set: {
          'sheets.$[sheet].fields.$[field]': body
        }
      },
      {
        arrayFilters: [
          { 
            'sheet._id': sheetId,
            'field._id': fieldId,
          },
        ],
        returnOriginal: false,
      },
    )

  return value
}

module.exports = updateSheetField


