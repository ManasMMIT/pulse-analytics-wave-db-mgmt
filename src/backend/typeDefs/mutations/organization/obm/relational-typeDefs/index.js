const serviceAndServiceCategoryTypeDefs = require('./serviceAndServiceCategory')
const obmAndServiceTypeDefs = require('./obmAndService')
const obmAndObmTypeTypeDefs = require('./obmAndObmType')
const obmAndPersonTypeDefs = require('./obmAndPerson')
const obmAndKeyEvent = require('./obmAndKeyEvent')

module.exports = [
  ...serviceAndServiceCategoryTypeDefs,
  ...obmAndServiceTypeDefs,
  ...obmAndObmTypeTypeDefs,
  ...obmAndPersonTypeDefs,
  ...obmAndKeyEvent,
]
