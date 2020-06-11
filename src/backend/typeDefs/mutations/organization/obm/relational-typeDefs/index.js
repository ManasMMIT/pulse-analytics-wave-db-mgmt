const serviceAndServiceCategoryTypeDefs = require('./serviceAndServiceCategory')
const obmAndServiceTypeDefs = require('./obmAndService')

module.exports = [
  ...serviceAndServiceCategoryTypeDefs,
  ...obmAndServiceTypeDefs,
]
