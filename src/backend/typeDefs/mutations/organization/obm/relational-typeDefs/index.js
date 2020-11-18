const serviceAndServiceCategoryTypeDefs = require('./serviceAndServiceCategory')
const obmAndServiceTypeDefs = require('./obmAndService')
const obmAndObmTypeTypeDefs = require('./obmAndObmType')
const obmAndPersonTypeDefs = require('./obmAndPerson')
const obmAndPayerTypeDefs = require('./obmAndPayer')
const obmAndKeyEvent = require('./obmAndKeyEvent')

module.exports = [
  ...serviceAndServiceCategoryTypeDefs,
  ...obmAndServiceTypeDefs,
  ...obmAndObmTypeTypeDefs,
  ...obmAndPersonTypeDefs,
  ...obmAndPayerTypeDefs,
  ...obmAndKeyEvent,
]
