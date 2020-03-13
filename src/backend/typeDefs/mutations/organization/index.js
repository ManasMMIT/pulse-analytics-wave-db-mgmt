const providerTypeDefs = require('./provider')
const payerTypeDefs = require('./payer')
const pathwaysTypeDefs = require('./pathways')
const apmTypeDefs = require('./apm')
const metaTypeDefs = require('./meta')

module.exports = [
  ...providerTypeDefs,
  ...payerTypeDefs,
  ...pathwaysTypeDefs,
  ...apmTypeDefs,
  ...metaTypeDefs,
]
