const serviceAndServiceCategoryResolvers = require('./serviceAndServiceCategory')
const obmAndServiceResolvers = require('./obmAndService')

module.exports = {
  ...serviceAndServiceCategoryResolvers,
  ...obmAndServiceResolvers,
}
