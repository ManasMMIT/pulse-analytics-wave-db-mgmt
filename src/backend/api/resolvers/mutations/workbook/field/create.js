const { ObjectId } = require('mongodb')

const createSheetField = async (
  parent,
  { input: { workbookId, sheetId, ...body } },
  { pulseCoreDb }
) => {
  workbookId = ObjectId(workbookId)
  sheetId = ObjectId(sheetId)

  const newFieldId = ObjectId()

  const { value: workbook } = await pulseCoreDb.collection('workbooksConfig')
    .findOneAndUpdate(
      { _id: workbookId },
      {
        $push: {
          'sheets.$[sheet].fields': { _id: newFieldId, ...body }
        }
      },
      {
        arrayFilters: [
          { 'sheet._id': sheetId },
        ],
        returnOriginal: false,
      },
    )

  const targetSheet = workbook.sheets.find(({ _id }) => _id.equals(sheetId))
  const newField = targetSheet.fields.find(({ _id }) => _id.equals(newFieldId))

  return newField
}

module.exports = createSheetField


