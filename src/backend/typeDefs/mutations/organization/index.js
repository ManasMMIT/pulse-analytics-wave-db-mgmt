const providerTypeDefs = require('./provider')
const payerTypeDefs = require('./payer')
const pathwaysTypeDefs = require('./pathways')
const apmTypeDefs = require('./apm')

const connections = require('./connections')

module.exports = [
  ...providerTypeDefs,
  ...payerTypeDefs,
  ...pathwaysTypeDefs,
  ...apmTypeDefs,
  ...connections,
]
