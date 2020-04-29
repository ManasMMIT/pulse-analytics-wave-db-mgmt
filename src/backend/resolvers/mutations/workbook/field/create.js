const { ObjectId } = require('mongodb')
const _ = require('lodash')

const createSheetField = async (
  parent,
  { input },
  { pulseCoreDb }
) => {
  let {
    workbookId,
    sheetId,
    type,
    oneOf,
    name,
    businessObjRef = null,
  } = input

  try {
    oneOf = JSON.parse('[' + oneOf + ']')
    if (_.isEmpty(oneOf)) oneOf = null
  } catch(e) {
    throw Error(`oneOf was improperly formatted`)
  }

  if (businessObjRef) {
    businessObjRef._id = ObjectId(businessObjRef._id)
    businessObjRef.fieldId = ObjectId(businessObjRef.fieldId)
  }

  workbookId = ObjectId(workbookId)
  sheetId = ObjectId(sheetId)

  const newFieldId = ObjectId()

  const { value: workbook } = await pulseCoreDb.collection('workbooksConfig')
    .findOneAndUpdate(
      { _id: workbookId },
      {
        $push: {
          'sheets.$[sheet].fields': { 
            _id: newFieldId, 
            type, 
            oneOf, 
            name,
            businessObjRef,
          }
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


