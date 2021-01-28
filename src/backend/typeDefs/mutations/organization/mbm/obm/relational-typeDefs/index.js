const obmAndPayerTypeDefs = require('./obmAndPayer')
const obmAndServiceTypeDefs = require('./obmAndService')
const obmAndObmTypeTypeDefs = require('./obmAndObmType')
const obmAndPersonTypeDefs = require('./obmAndPerson')
const obmAndKeyEvent = require('./obmAndKeyEvent')

module.exports = [
  ...obmAndPayerTypeDefs,
  ...obmAndServiceTypeDefs,
  ...obmAndObmTypeTypeDefs,
  ...obmAndPersonTypeDefs,
  ...obmAndKeyEvent,
]
