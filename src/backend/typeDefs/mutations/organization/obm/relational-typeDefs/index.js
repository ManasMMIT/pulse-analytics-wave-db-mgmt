const serviceAndServiceCategoryTypeDefs = require('./serviceAndServiceCategory')
const obmAndServiceTypeDefs = require('./obmAndService')
const obmAndPersonTypeDefs = require('./obmAndPerson')
const obmAndPayerTypeDefs = require('./obmAndPayer')

module.exports = [
  ...serviceAndServiceCategoryTypeDefs,
  ...obmAndServiceTypeDefs,
  ...obmAndPersonTypeDefs,
  ...obmAndPayerTypeDefs,
]
