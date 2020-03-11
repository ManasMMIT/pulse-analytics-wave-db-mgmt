const _ = require('lodash')

const VALIDATION_MAP = [
  {
    docField: 'name',
    sheetField: 'indication',
    collectionName: 'indications',
  },
  {
    docField: 'name',
    sheetField: 'regimen',
    collectionName: 'regimens',
  },
  {
    docField: 'slug',
    sheetField: 'slug',
    collectionName: 'organizations',
  },
  {
    docField: 'access',
    sheetField: 'access',
    collectionName: 'qualityOfAccessScore',
  },
]

const getValidFieldsPromises = core => VALIDATION_MAP.map(async ({ sheetField, docField, collectionName }) => {
  const docs = await core.collection(collectionName).find().toArray()

  const validFields = Object.keys(
    _.keyBy(docs, docField)
  )

  return ({
    fieldType: sheetField,
    validFields,
  })
})

const getValidFieldsByType = async core => {
  const validFields = await Promise.all(getValidFieldsPromises(core))

  return validFields.reduce((acc, {
    fieldType,
    validFields,
  }) => {
    acc[fieldType] = validFields

    return acc
  }, {})
}

module.exports = getValidFieldsByType
