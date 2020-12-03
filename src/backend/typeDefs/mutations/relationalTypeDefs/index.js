const pathwaysAndPersonTypeDefs = require('./pathwaysAndPerson')
const obmAndPayerTypeDefs = require('./obmAndPayer')

module.exports = [...pathwaysAndPersonTypeDefs, ...obmAndPayerTypeDefs]
