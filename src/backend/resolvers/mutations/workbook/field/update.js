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
  } = input

  try {
    oneOf = JSON.parse('[' + oneOf + ']')
    if (_.isEmpty(oneOf)) oneOf = null
  } catch (e) {
    throw Error(`oneOf was improperly formatted`)
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


