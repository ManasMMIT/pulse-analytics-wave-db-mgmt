const { parse, parseISO } = require('date-fns')
const { zonedTimeToUtc } = require('date-fns-tz')

const DEFAULT_TIMEZONE = require('../../../../../../../utils/defaultTimeZone')

const isValidDate = obj => obj instanceof Date && !isNaN(obj)

const addDateCustomKeyword = ajv => ajv.addKeyword('coerceToDate', {
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

module.exports = addDateCustomKeyword
