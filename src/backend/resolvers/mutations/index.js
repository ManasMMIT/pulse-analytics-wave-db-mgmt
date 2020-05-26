const clientResolvers = require('./client')
const teamResolvers = require('./team')
const userResolvers = require('./user')
const indicationResolvers = require('./indication')
const productResolvers = require('./product')
const regimenResolvers = require('./regimen')
const organizationResolvers = require('./organization')
const sitemapResolvers = require('./sitemap')
const qualityOfAccessScoreResolvers = require('./qualityOfAccessScore')
const collectionResolvers = require('./collection')
const treatmentPlan = require('./treatmentPlan')
const testEmailGroupResolvers = require('./testEmailGroup')
const workbookResolvers = require('./workbook')

const emailResolvers = require('./email')

const queryResolvers = require('./query')

const payerProjectResolvers = require('./payerProject')

const businessObjectResolvers = require('./businessObject')
const businessObjectModalResolvers = require('./businessObjectModal')

const bookResolvers = require('./book')
const coverageResolvers = require('./coverage')
const populationResolvers = require('./population')
const lineResolvers = require('./line')

const importWorkbook = require('./importWorkbook')

module.exports = {
  ...clientResolvers,
  ...teamResolvers,
  ...userResolvers,
  ...indicationResolvers,
  ...productResolvers,
  ...sitemapResolvers,
  ...regimenResolvers,
  ...qualityOfAccessScoreResolvers,
  ...collectionResolvers,
  ...treatmentPlan,
  ...organizationResolvers,

  ...emailResolvers,
  ...testEmailGroupResolvers,

  ...queryResolvers,

  ...workbookResolvers,

  ...payerProjectResolvers,

  ...businessObjectResolvers,
  ...businessObjectModalResolvers,

  ...bookResolvers,
  ...coverageResolvers,
  ...lineResolvers,
  ...populationResolvers,

  importWorkbook,
}
