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
const testEmailGroups = require('./testEmailGroups')
const alert = require('./alert')
const opLogs = require('./opLogs')
const bomSchema = require('./bomSchema')
const workbooks = require('./workbooks')
const singlePayerProject = require('./singlePayerProject')
const payerProjectsList = require('./payerProjectsList')
const treatmentPlans = require('./treatmentPlans')
const projectPtps = require('./projectPtps')
const payerCombinedStateLives = require('./payerCombinedStateLives')

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
  ...organizations,
  testEmailGroups,
  alert,
  opLogs,
  bomSchema,
  workbooks,
  singlePayerProject,
  payerProjectsList,
  treatmentPlans,
  projectPtps,
  payerCombinedStateLives,
}
