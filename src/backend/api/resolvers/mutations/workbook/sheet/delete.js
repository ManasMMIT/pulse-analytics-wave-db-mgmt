const { ObjectId } = require('mongodb')

const deleteSheet = async (
  parent,
  { input: { workbookId, sheetId } },
  { pulseCoreDb },
  info,
) => {
  workbookId = ObjectId(workbookId)
  sheetId = ObjectId(sheetId)

  const { value } = await pulseCoreDb.collection('workbooksConfig')
    .findOneAndUpdate(
      { _id: workbookId },
      {
        $pull: {
          'sheets._id': sheetId
        }
      },
      { returnOriginal: false }
    )

  return value
}

module.exports = deleteSheet
