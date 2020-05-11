const Ajv = require('ajv')
const AjvErrors = require('ajv-errors')

const addDateCustomKeyword = require('./addDateCustomKeyword')
const addLocationCustomKeyword = require('./addLocationCustomKeyword')

const ajv = new Ajv({
  allErrors: true,
  coerceTypes: 'array',
  jsonPointers: true,
  useDefaults: "empty",
  removeAdditional: 'all',
})

AjvErrors(ajv)
addDateCustomKeyword(ajv)
addLocationCustomKeyword(ajv)

module.exports = ajv
