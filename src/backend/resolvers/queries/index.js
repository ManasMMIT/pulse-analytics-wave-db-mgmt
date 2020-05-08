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
const businessObjects = require('./businessObjects')
const workbooks = require('./workbooks')
const treatmentPlans = require('./treatmentPlans')
const regionalTargetingData = require('./regionalTargetingData')
const populations = require('./populations')
const lines = require('./lines')

const payerProjects = require('./payerProjects')

const cMsOrgPrimarySpecialtyCounts = require('./cMsOrgPrimarySpecialtyCounts')

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
  businessObjects,
  workbooks,
  treatmentPlans,
  populations,
  lines,
  ...payerProjects,
  regionalTargetingData,
  cMsOrgPrimarySpecialtyCounts,
}
