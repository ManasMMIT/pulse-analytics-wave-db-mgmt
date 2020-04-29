const { ObjectId } = require('mongodb')
const _ = require('lodash')

const updateSheetField = async (
  parent,
  { input },
  { pulseCoreDb }
) => {
  let {
    workbookId,
    sheetId,
    fieldId,
    type,
    oneOf,
    name,
    businessObjRef = null,
  } = input

  try {
    oneOf = JSON.parse('[' + oneOf + ']')
    if (_.isEmpty(oneOf)) oneOf = null
  } catch (e) {
    throw Error(`oneOf was improperly formatted`)
  }

  if (businessObjRef) {
    businessObjRef._id = ObjectId(businessObjRef._id)
    businessObjRef.fieldId = ObjectId(businessObjRef.fieldId)
  }

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
            type,
            name,
            oneOf,
            businessObjRef,
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


