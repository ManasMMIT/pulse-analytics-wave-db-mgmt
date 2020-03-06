const { ObjectId } = require('mongodb')

const createSheetField = async (
  parent,
  { input: { workbookId, sheetId, ...body } },
  { pulseCoreDb }
) => {
  workbookId = ObjectId(workbookId)
  sheetId = ObjectId(sheetId)

  const { value } = await pulseCoreDb.collection('workbooksConfig')
    .findOneAndUpdate(
      { _id: workbookId },
      {
        $push: {
          'sheets.$[sheet].fields': { _id: ObjectId(), ...body }
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

module.exports = createSheetField


