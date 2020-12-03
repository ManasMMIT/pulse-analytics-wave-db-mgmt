const _ = require('lodash')

const PAYER_TOOL_ID = 'a3f419de-ca7d-4498-94dd-04fb9f6b8777'

module.exports = async ({ targetTeam, pulseDevDb, treatmentPlan }) => {
  const firstUser = targetTeam.users[0]

  let payerToolNodeResources
  if (firstUser) {
    const firstUserId = firstUser._id

    const targetUser = await pulseDevDb
      .collection('users.nodes.resources')
      .findOne({ _id: firstUserId })

    payerToolNodeResources = targetUser.resources.find(
      ({ nodeId }) => PAYER_TOOL_ID === nodeId
    )
  }

  if (!payerToolNodeResources) {
    console.error(
      "Selected team either doesn't have access to payer tool or doesn't have a single user, skipping node accounts/tps permissions when generating data"
    )
    payerToolNodeResources = { accounts: [], treatmentPlans: [] }
  }

  const { accounts, treatmentPlans } = payerToolNodeResources
  const permittedSlugs = accounts.map(({ slug }) => slug)

  const permittedIndRegCombos = treatmentPlans.reduce(
    (acc, { name: indication, regimens }) => {
      regimens.forEach(({ name: regimen }) => {
        acc.push({ indication, regimen })
      })

      return acc
    },
    []
  )

  const slugInFindObj = permittedSlugs.length
    ? { slug: { $in: permittedSlugs } }
    : {}

  const indRegOrFindObj = permittedIndRegCombos.length
    ? { $or: permittedIndRegCombos }
    : {}

  const payersForSelectedTreatmentPlan = await pulseDevDb
    .collection('payerHistoricalCombinedData')
    .find({
      ...treatmentPlan,
      ...slugInFindObj,
      ...indRegOrFindObj,
    })
    .toArray()

  if (_.isEmpty(payersForSelectedTreatmentPlan)) {
    throw new Error(
      '\n\nNo Quality of Access data for selected treatment plan and/or role permissions.\n' +
        "- Check the team's payer tool permissions in Phoenix for selected treatment plan.\n" +
        '- Reach out to Chuck with any additional questions on export failure.'
    )
  }

  return payersForSelectedTreatmentPlan || []
}
