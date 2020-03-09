const { ObjectId } = require('mongodb')

const updateSheetField = async (
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
        $set: {
          'sheets.$[sheet].fields.$[field]': {
            _id: fieldId,
            ...body,
          }
        }
      },
      {
        arrayFilters: [
          { 'sheet._id': sheetId },
          { 'field._id': fieldId },
        ],
        returnOriginal: false,
      },
    )

  const targetSheet = workbook.sheets.find(({ _id }) => _id.equals(sheetId))
  const updatedField = targetSheet.fields.find(({ _id }) => _id.equals(fieldId))

  return updatedField
}

module.exports = updateSheetField


