const serviceAndServiceCategoryResolvers = require('./serviceAndServiceCategory')
const obmAndServiceResolvers = require('./obmAndService')
const obmAndPersonResolvers = require('./obmAndPerson')

module.exports = {
  ...serviceAndServiceCategoryResolvers,
  ...obmAndServiceResolvers,
  ...obmAndPersonResolvers,
}
