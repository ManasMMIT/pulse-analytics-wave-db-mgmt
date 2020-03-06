const { ObjectId } = require('mongodb')

const createSheet = async (
  parent, 
  { input: { workbookId, sheetId, ...body } }, // destructure out sheetId because same form is used for updating existing sheet
  { pulseCoreDb }
) => {
  workbookId = ObjectId(workbookId)

  const { value } = await pulseCoreDb.collection('workbooksConfig')
    .findOneAndUpdate(
      { _id: workbookId },
      {
        $push: {
          'sheets': { 
            _id: ObjectId(), 
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

    return value
}

module.exports = createSheet
