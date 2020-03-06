const { ObjectId } = require('mongodb')

const updateSheet = async (
  parent,
  { input: { workbookId, sheetId, name } },
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
          'sheets.$.name': name // if you only use $ without dotting further, op will replace the whole subdoc
        }
      },
      { returnOriginal: false }
    )

  return value
}

module.exports = updateSheet
