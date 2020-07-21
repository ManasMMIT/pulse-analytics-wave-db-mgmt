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
const bomConfigs = require('./bomConfigs')
const businessObjects = require('./businessObjects')
const workbooks = require('./workbooks')
const treatmentPlans = require('./treatmentPlans')
const regionalTargetingData = require('./regionalTargetingData')
const books = require('./books')
const coverages = require('./coverages')
const populations = require('./populations')
const lines = require('./lines')
const endUserTerms = require('./endUserTerms')

const payerProjects = require('./payerProjects')

const cMsOrgPrimarySpecialtyCounts = require('./cMsOrgPrimarySpecialtyCounts')

const aquila = require('./aquila')

const people = require('./people')

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
  ...opLogs,
  bomSchema,
  bomConfigs,
  businessObjects,
  workbooks,
  treatmentPlans,
  books,
  coverages,
  populations,
  lines,
  ...payerProjects,
  regionalTargetingData,
  cMsOrgPrimarySpecialtyCounts,
  ...aquila,
  ...people,
  endUserTerms,
}
