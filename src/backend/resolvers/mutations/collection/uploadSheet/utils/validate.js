const Ajv = require('ajv')

const ajv = new Ajv({ 
  allErrors: true, 
  coerceTypes: 'array',
  jsonPointers: true,
})

const validate = ({ data, skippedRows, sheetConfig }) => {
  const ajvSchema = getAjvSchema(sheetConfig)
  const ajvValidate = ajv.compile(ajvSchema)

  const csvKeys = sheetConfig.fields.reduce((acc, { name, type }) => {
    if (type === 'csv') acc.push(name)
    return acc
  }, [])

  let errors = []

  let areAllRowsValid = true

  const totalRowCountPlusHeader = skippedRows.length + data.length + 1

  let i = 0
  let j = 0
  let curRowNumInSheet = 2 // to keep proper track of row num in sheet, don't start with header row
  
  while (curRowNumInSheet <= totalRowCountPlusHeader) {
    if (skippedRows[i] === curRowNumInSheet) {
      i++
      curRowNumInSheet++
      continue
    }
    
    const datum = data[j]
    
    csvKeys.forEach(csvKey => {
      if (datum[csvKey]) {
        datum[csvKey] = datum[csvKey].split(',').map(str => str.trim())
      }
    })

    const valid = ajvValidate(datum)

    if (!valid) {
      ajvValidate.errors.forEach(error => { // eslint-disable-line no-loop-func
        errors.push({
          error: error,
          rowNum: curRowNumInSheet,
          datum,
        })
      })

      areAllRowsValid = false
    }

    j++
    curRowNumInSheet++
  }

  return { valid: areAllRowsValid, errors, data }
}

// ! schema structure looks like
// ? REFERENCE: types you can use https://github.com/epoberezkin/ajv/blob/master/KEYWORDS.md#type
// {
//   properties: {
//     foo: { 
//       type: "string",
//       enum: ['hello', "world"],
//     }, 
//     bar: { 
//       type: "number", 
//       maximum: 3,
//     }
//     list: { // ! ex of schema def if type is CSV and has "oneOf" constraint
//       type: "array", 
//       items: {
//         type: "string",
//         enum: ['hello', "world"],
//       } 
//     },
//   }
// }
const getAjvSchema = ({ fields }) => {
  const schema = { properties: {} }
  const schemaProperties = schema.properties

  fields.forEach(({ name, type, oneOf }) => {
    if (type === 'csv') {
      schemaProperties[name] = {
        type: 'array',
        items: { type: 'string' }
      }

      if (oneOf) {
        oneOf = oneOf.map(TYPE_MAP[type]) // coerce oneOf values to the type specified
        schemaProperties[name].items.enum = oneOf
      }
    } else {
      schemaProperties[name] = { type }

      if (oneOf) {
        oneOf = oneOf.map(TYPE_MAP[type]) // coerce oneOf values to the type specified
        schemaProperties[name].enum = oneOf
      }
    }
  })

  return schema
}

const TYPE_MAP = {
  csv: String,
  number: Number,
  integer: Number,
  string: String,
  boolean: Boolean,
  array: Array,
  object: Object,
  null: null,
}

module.exports = validate
