const Ajv = require('ajv')

const ajv = new Ajv({ 
  allErrors: true, 
  coerceTypes: 'array',
  jsonPointers: true,
})

const validate = ({ data, skippedRows, sheetConfig }) => {
  const ajvSchema = getAjvSchema(sheetConfig)
  const ajvValidate = ajv.compile(ajvSchema)

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

    const valid = ajvValidate(datum)

    if (!valid) {
      errors.push({
        error: ajvValidate.errors[0],
        rowNum: curRowNumInSheet,
        datum,
      })

      areAllRowsValid = false
    }

    j++
    curRowNumInSheet++
  }

  return { valid: areAllRowsValid, errors, data }
}

// ! schema structure looks like
// {
//   properties: {
//     foo: { type: "string" }, // REFERENCE: types you can use https://github.com/epoberezkin/ajv/blob/master/KEYWORDS.md#type
//     bar: { type: "number", maximum: 3 }
//   }
// }
const getAjvSchema = ({ fields }) => {
  const schema = { properties: {} }
  const schemaProperties = schema.properties

  fields.forEach(({ name, type, oneOf }) => {
    schemaProperties[name] = { type }
    
    if (oneOf) {
      oneOf = oneOf.map(TYPE_MAP[type]) // coerce oneOf values to the type specified
      schemaProperties[name].enum = oneOf
    }
  })

  return schema
}

const TYPE_MAP = {
  number: Number,
  integer: Number,
  string: String,
  boolean: Boolean,
  array: Array,
  object: Object,
  null: null,
}

module.exports = validate
