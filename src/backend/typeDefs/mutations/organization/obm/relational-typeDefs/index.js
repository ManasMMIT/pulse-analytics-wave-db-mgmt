const serviceAndServiceCategoryTypeDefs = require('./serviceAndServiceCategory')
const obmAndServiceTypeDefs = require('./obmAndService')
const obmAndPersonTypeDefs = require('./obmAndPerson')
const obmAndPayerTypeDefs = require('./obmAndPayer')
const obmAndKeyEvent = require('./obmAndKeyEvent')

module.exports = [
  ...serviceAndServiceCategoryTypeDefs,
  ...obmAndServiceTypeDefs,
  ...obmAndPersonTypeDefs,
  ...obmAndPayerTypeDefs,
  ...obmAndKeyEvent,
]
