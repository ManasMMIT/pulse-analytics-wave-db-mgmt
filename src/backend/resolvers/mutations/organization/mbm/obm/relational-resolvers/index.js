const obmAndPayerResolvers = require('./obmAndPayer')
const obmAndServiceResolvers = require('./obmAndService')
const obmAndPersonResolvers = require('./obmAndPerson')
const obmAndObmTypeResolvers = require('./obmAndObmType')
const obmAndKeyEventResolvers = require('./obmAndKeyEvent')

module.exports = {
  ...obmAndPayerResolvers,
  ...obmAndServiceResolvers,
  ...obmAndPersonResolvers,
  ...obmAndObmTypeResolvers,
  ...obmAndKeyEventResolvers,
}
