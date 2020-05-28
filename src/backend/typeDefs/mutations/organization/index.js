const providerTypeDefs = require('./provider')
const payerTypeDefs = require('./payer')
const pathwaysTypeDefs = require('./pathways')
const apmTypeDefs = require('./apm')
const obmTypeDefs = require('./obm')
const metaTypeDefs = require('./meta')

module.exports = [
  ...providerTypeDefs,
  ...payerTypeDefs,
  ...pathwaysTypeDefs,
  ...apmTypeDefs,
  ...obmTypeDefs,
  ...metaTypeDefs,
]
