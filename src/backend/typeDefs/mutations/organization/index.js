const providerTypeDefs = require('./provider')
const payerTypeDefs = require('./payer')
const pathwaysTypeDefs = require('./pathways')
const apmTypeDefs = require('./apm')

module.exports = [
  ...providerTypeDefs,
  ...payerTypeDefs,
  ...pathwaysTypeDefs,
  ...apmTypeDefs,
]
