
const getFieldBoEnumMap = require('./getFieldBoEnumMap')

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

const TYPE_MAP = {
  csv: String,
  location: String,
  number: Number,
  integer: Number,
  string: String,
  boolean: Boolean,
  array: Array,
  object: Object,
  null: () => null,
}

const populateSchemaProperties = async ({ fields, schemaProperties, db }) => {
  // process all business object-related querying all simultaneously and upfront
  // and create a map that can override any oneOf as needed in the following step
  const fieldBoEnumMap = await getFieldBoEnumMap(fields, db)

  fields.forEach(({ _id, name, type, oneOf }) => {
    // override manual oneOf if the field has business object validation on it
    if (fieldBoEnumMap[_id]) oneOf = fieldBoEnumMap[_id]

    if (type === 'csv') {
      schemaProperties[name] = {
        type: 'array',
        items: { type: 'string' },
        default: [],
      }

      if (oneOf) {
        oneOf = oneOf.map(TYPE_MAP[type]) // coerce oneOf values to the type specified

        schemaProperties[name].items.enum = oneOf

        // ! if oneOf includes an empty string, interpret that as proxy for 
        // ! it being okay for a blank csv to persist as an empty array 
        // ! and leave the `default: []` setting in the validation; 
        // ! otherwise, don't allow blanks by deleting the default
        const oneOfHasEmptyString = oneOf.includes('')
        if (!oneOfHasEmptyString) delete schemaProperties[name].default
      }
    } else if (type === 'date') {
      schemaProperties[name] = {
        anyOf: [
          { type: 'null' },
          {
            allOf: [
              { type: 'string' },
              { coerceToDate: true },
            ]
          }
        ],
        errorMessage: "Invalid date; make cell Date type OR format as yyyy-MM-dd, d/M/yy, or dd/MM/yyyy",
      }
    } else if (type === 'location') {
      schemaProperties[name] = {
        anyOf: [
          // if location cell is null, 'validateLocation' step doesn't 
          // happen and no side effect data is produced for that row; 
          // consequence is schema becomes uneven; when data finally persists, 
          // some docs have 'lat', 'long', 'locationCityState'; others may not
          { type: 'null' },
          {
            allOf: [
              { type: 'string' },
              { validateLocation: true },
            ]
          }
        ],
        errorMessage: "Invalid location; try another location string or blank out the cell",
      }
    } else {
      schemaProperties[name] = { type: ['null', type] }

      if (oneOf) {
        // coerce oneOf values to the type specified
        oneOf = oneOf.map(val => {
          // ! a blank string means a blank cell is allowed, but blank cells once jsonified 
          // ! are null, not "" so this override is needed
          if (val === "") return null

          return TYPE_MAP[type](val)
        })

        schemaProperties[name].enum = oneOf
      }
    }
  })
}

const getAjvSchema = async (fields, db) => {
  const schema = { '$async': true, properties: {} }
  const schemaProperties = schema.properties

  schema.required = fields.map(({ name }) => name)

  await populateSchemaProperties({ fields, schemaProperties, db })

  return schema
}

module.exports = getAjvSchema
