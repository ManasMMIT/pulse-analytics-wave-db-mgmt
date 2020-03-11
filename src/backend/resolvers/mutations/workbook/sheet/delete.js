const { ObjectId } = require('mongodb')

const deleteSheet = async (
  parent,
  { input: { workbookId, sheetId } },
  { pulseCoreDb },
  info,
) => {
  workbookId = ObjectId(workbookId)
  sheetId = ObjectId(sheetId)

  const { value: workbook } = await pulseCoreDb.collection('workbooksConfig')
    .findOneAndUpdate(
      { _id: workbookId },
      {
        $pull: {
          sheets: { _id: sheetId }
        }
      },
      // { returnOriginal: false } // get the original to return what was deleted
    )

  const deletedSheet = workbook.sheets.find(({ _id }) => _id.equals(sheetId))

  return deletedSheet
}

module.exports = deleteSheet
