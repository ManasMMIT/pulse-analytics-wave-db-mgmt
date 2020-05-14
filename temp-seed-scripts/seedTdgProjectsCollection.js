const _ = require('lodash')

module.exports = async ({
  pulseCore,
  payerHistoricalQualityAccess,
}) => {
  const date = new Date()
  await pulseCore.collection('tdgProjects').deleteMany()

  const onlyOrgTreatmentPlanDocs = payerHistoricalQualityAccess.filter(thing => (
    thing.project
    && thing.slug
    && thing.indication
    && thing.regimen
    && thing.line
    && thing.population
    && thing.book
    && thing.coverage
  ))

  const historicalProjects = _.keyBy(onlyOrgTreatmentPlanDocs, 'project')

  const tdgProjects = Object.keys(historicalProjects)
    .map(project => ({
      name: project,
      orgTpIds: [],
      extraOrgTpIds: [],
      createdOn: date,
      updatedOn: date,
    }))

  await pulseCore.collection('tdgProjects').insertMany(tdgProjects)

  console.log('`tdgProjects` collection seeded/n')
}
