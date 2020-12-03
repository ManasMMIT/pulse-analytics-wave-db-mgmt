const pathwaysAndPersonConnectionResolvers = require('./pathwaysAndPerson')
const obmAndPayerResolvers = require('./obmAndPayer')

module.exports = {
  ...pathwaysAndPersonConnectionResolvers,
  ...obmAndPayerResolvers,
}
