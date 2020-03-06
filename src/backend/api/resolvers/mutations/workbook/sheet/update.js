const { ObjectId } = require('mongodb')

const updateSheet = async (
  parent,
  { input: { workbookId, sheetId, ...body } },
  { pulseCoreDb },
  info,
) => {
  workbookId = ObjectId(workbookId)
  sheetId = ObjectId(sheetId)

  const { value } = await pulseCoreDb.collection('workbooksConfig')
    .findOneAndUpdate(
      { 
        _id: workbookId, 
        'sheets._id': sheetId 
      },
      {
        $set: {
          'sheets.$': body
        }
      },
      { returnOriginal: false }
    )

  return value
}

module.exports = updateSheet
