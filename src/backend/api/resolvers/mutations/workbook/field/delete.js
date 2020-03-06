const { ObjectId } = require('mongodb')

const deleteSheetField = async (
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
        $pull: {
          'sheets.$[sheet].fields._id': fieldId
        }
      },
      {
        arrayFilters: [
          { 'sheet._id': sheetId },
        ],
        returnOriginal: false,
      },
    )

  return value
}

module.exports = deleteSheetField


