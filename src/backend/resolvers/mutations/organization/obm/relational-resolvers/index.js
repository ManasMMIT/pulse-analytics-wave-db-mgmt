const serviceAndServiceCategoryResolvers = require('./serviceAndServiceCategory')
const obmAndServiceResolvers = require('./obmAndService')
const obmAndPersonResolvers = require('./obmAndPerson')
const obmAndObmTypeResolvers = require('./obmAndObmType')
const obmAndPayerResolvers = require('./obmAndPayer')
const obmAndKeyEventResolvers = require('./obmAndKeyEvent')

module.exports = {
  ...serviceAndServiceCategoryResolvers,
  ...obmAndServiceResolvers,
  ...obmAndPersonResolvers,
  ...obmAndObmTypeResolvers,
  ...obmAndPayerResolvers,
  ...obmAndKeyEventResolvers,
}
