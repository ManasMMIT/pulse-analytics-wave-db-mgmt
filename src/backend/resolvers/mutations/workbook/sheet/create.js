const { ObjectId } = require('mongodb')

const createSheet = async (
  parent, 
  { input: { workbookId, sheetId, ...body } }, // destructure out sheetId because same form is used for updating existing sheet
  { pulseCoreDb }
) => {
  workbookId = ObjectId(workbookId)

  const newSheetId = ObjectId()

  const { value: workbook } = await pulseCoreDb.collection('workbooksConfig')
    .findOneAndUpdate(
      { _id: workbookId },
      {
        $push: {
          'sheets': { 
            _id: newSheetId, 
            fields: [
              {
                _id: ObjectId(),
                name: 'Default Field',
                type: 'string',
                oneOf: null,
              }
            ], 
            ...body 
          }
        }
      },
      {
        returnOriginal: false,
      }
    )

  const newSheet = workbook.sheets.find(({ _id }) => _id.equals(newSheetId))

  return newSheet
}

module.exports = createSheet
