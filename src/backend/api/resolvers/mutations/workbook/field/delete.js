const { ObjectId } = require('mongodb')

const deleteSheetField = async (
  parent,
  { input: { workbookId, sheetId, fieldId, ...body } },
  { pulseCoreDb }
) => {
  workbookId = ObjectId(workbookId)
  sheetId = ObjectId(sheetId)
  fieldId = ObjectId(fieldId)

  const { value: workbook } = await pulseCoreDb.collection('workbooksConfig')
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
        // { returnOriginal: false } // get the original to return what was deleted
      },
    )

  const targetSheet = workbook.sheets.find(({ _id }) => _id.equals(sheetId))
  const deletedField = targetSheet.fields.find(({ _id }) => _id.equals(fieldId))

  return deletedField
}

module.exports = deleteSheetField


