const Ajv = require('ajv')
const AjvErrors = require('ajv-errors')
const _ = require('lodash')
const { parse, parseISO } = require('date-fns')
const { zonedTimeToUtc } = require('date-fns-tz')

const DEFAULT_TIMEZONE = require('../../../../../utils/defaultTimeZone')

const getFieldBoEnumMap = require('./getFieldBoEnumMap')

const ajv = new Ajv({ 
  allErrors: true, 
  coerceTypes: 'array',
  jsonPointers: true,
  useDefaults: "empty",
  removeAdditional: 'all',
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

const validate = async ({ data, skippedRows, sheetConfig, db }) => {
  const ajvSchema = await getAjvSchema(sheetConfig, db)
  const ajvValidate = ajv.compile(ajvSchema)

  const csvKeys = sheetConfig.fields.reduce((acc, { name, type }) => {
    if (type === 'csv') acc.push(name)
    return acc
  }, [])

  let errors = []

  let areAllRowsValid = true

  const totalRowCountPlusHeader = skippedRows.length + data.length + 1

  let rowsTracker = {} // for detecting dupes
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
    
    const serializedDatum = JSON.stringify(datum)
    let entryInRowsTracker = rowsTracker[serializedDatum]
    const newEntry = { datum, rowNum: curRowNumInSheet }

    if (entryInRowsTracker) {
      entryInRowsTracker.push(newEntry)
    } else {
      rowsTracker[serializedDatum] = [newEntry]
    }

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

  const dupeRows = _.filter(rowsTracker, groupOfRows => groupOfRows.length > 1)
  if (dupeRows.length) areAllRowsValid = false

  dupeRows.forEach(groupOfDupes => {
    const { datum, rowNum } = groupOfDupes[0]

    let errorMessage = `Row ${rowNum} is duplicated on row(s) `
    const rowNums = groupOfDupes.slice(1).map(({ rowNum }) => rowNum).join(', ')

    errorMessage += rowNums

    errors.unshift({
      error: errorMessage,
      rowNum,
      datum,
    })
  }) 

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
const getAjvSchema = async ({ fields }, db) => {
  const schema = { properties: {} }
  const schemaProperties = schema.properties

  await populateSchemaProperties({ fields, schemaProperties, db })

  return schema
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
