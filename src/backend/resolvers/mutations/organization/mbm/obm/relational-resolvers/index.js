const serviceAndServiceCategoryResolvers = require('./serviceAndServiceCategory')
const obmAndServiceResolvers = require('./obmAndService')
const obmAndPersonResolvers = require('./obmAndPerson')
const obmAndObmTypeResolvers = require('./obmAndObmType')
const obmAndKeyEventResolvers = require('./obmAndKeyEvent')

module.exports = {
  ...serviceAndServiceCategoryResolvers,
  ...obmAndServiceResolvers,
  ...obmAndPersonResolvers,
  ...obmAndObmTypeResolvers,
  ...obmAndKeyEventResolvers,
}
