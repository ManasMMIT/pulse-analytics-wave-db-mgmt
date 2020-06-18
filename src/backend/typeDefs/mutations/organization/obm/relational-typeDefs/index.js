const serviceAndServiceCategoryTypeDefs = require('./serviceAndServiceCategory')
const obmAndServiceTypeDefs = require('./obmAndService')
const obmAndPersonTypeDefs = require('./obmAndPerson')

module.exports = [
  ...serviceAndServiceCategoryTypeDefs,
  ...obmAndServiceTypeDefs,
  ...obmAndPersonTypeDefs,
]
