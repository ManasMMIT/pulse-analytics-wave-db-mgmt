const clients = require('./clients')
const teams = require('./teams')
const users = require('./users')
const nodes = require('./nodes')
const indications = require('./indications')
const products = require('./products')
const regimens = require('./regimens')
const organizations = require('./organizations')
const qualityOfAccessScores = require('./qualityOfAccessScores')
const collections = require('./collections')
const newTreatmentPlans = require('./newTreatmentPlans')
const emailUsers = require('./emailUsers')
const testEmailGroups = require('./testEmailGroups')
const queryToolAccounts = require('./queryTool')

module.exports = {
  collections,
  clients,
  teams,
  users,
  nodes,
  indications,
  products,
  regimens,
  qualityOfAccessScores,
  newTreatmentPlans,
  emailUsers,
  ...organizations,
  testEmailGroups,
  queryToolAccounts,
}
