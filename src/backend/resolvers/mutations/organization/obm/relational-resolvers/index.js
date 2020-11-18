const serviceAndServiceCategoryResolvers = require('./serviceAndServiceCategory')
const obmAndServiceResolvers = require('./obmAndService')
const obmAndPersonResolvers = require('./obmAndPerson')
const obmAndPayer = require('./obmAndPayer')
const obmAndKeyEventResolvers = require('./obmAndKeyEvent')

module.exports = {
  ...serviceAndServiceCategoryResolvers,
  ...obmAndServiceResolvers,
  ...obmAndPersonResolvers,
  ...obmAndPayer,
  ...obmAndKeyEventResolvers,
}
