const Ajv = require('ajv')
const AjvErrors = require('ajv-errors')
const _ = require('lodash')
const { parse, parseISO } = require('date-fns')
const { zonedTimeToUtc } = require('date-fns-tz')

const DEFAULT_TIMEZONE = require('../../../../../utils/defaultTimeZone')

const ajv = new Ajv({ 
  allErrors: true, 
  coerceTypes: 'array',
  jsonPointers: true,
  useDefaults: "empty",
})

AjvErrors(ajv)

const isValidDate = obj => obj instanceof Date && !isNaN(obj)

ajv.addKeyword('coerceToDate', {
  modifying: true,
  compile: (schema, parentSchema, it) => {
    return (data, dataPath, parentData, parentKey) => {
      // if string has a slash, attempt to get ISO string from possible 'M/d/yy' or 'M/d/yyyy' formats
      if (typeof data === 'string' && data.match('/')) {
        const parseAttempt1 = parse(data, 'M/d/yy', new Date())
        if (isValidDate(parseAttempt1)) {
          data = parseAttempt1.toISOString()
        } else {
          const parseAttempt2 = parse(data, 'M/d/yyyy', new Date())
          if (isValidDate(parseAttempt2)) data = parseAttempt2.toISOString()
        }
      }

      const isoParseAttempt = parseISO(data)

      // if ISO string, shorten the string to ISO short to avoid daylight savings problems
      if (isValidDate(isoParseAttempt)) {
        const isoShortString = data.slice(0, 10)
        // create JS Date Object (which uses absolute UTC time) but fix it to New York time
        const dateObj = zonedTimeToUtc(isoShortString, DEFAULT_TIMEZONE)
        parentData[parentKey] = dateObj
        return true
      }
      
      return false
    }
  },
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
    
    // eslint-disable-next-line no-loop-func
    csvKeys.forEach(csvKey => {
      if (datum[csvKey]) {
        datum[csvKey] = datum[csvKey].split(',')
          .reduce((acc, str) => {
            const trimmedStr = str.trim()

            // skip any value that's trimmed down to an empty string
            if (trimmedStr !== '') acc.push(trimmedStr)

            return acc
          }, [])

        // if the arr is empty after the above step, that means all values were trimmed
        // to nothing and we should just treat the cell as if it's blank; this'll always
        // get defaulted to an empty array later in the process UNLESS oneOf exists and
        // doesn't include an empty string, in which case we need to keep this null
        // to error out later
        if (_.isEmpty(datum[csvKey])) datum[csvKey] = null
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

  populateSchemaProperties({ fields, schemaProperties })

  return schema
}

const populateSchemaProperties = ({ fields, schemaProperties }) => {
  fields.forEach(({ name, type, oneOf }) => {
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
        // ! it being okay for a blank csv to persist as an empty array and adjust validation; 
        // ! otherwise, don't allow blanks by deleting the default of []
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

const TYPE_MAP = {
  csv: String,
  number: Number,
  integer: Number,
  string: String,
  boolean: Boolean,
  array: Array,
  object: Object,
  null: () => null,
}

module.exports = validate
