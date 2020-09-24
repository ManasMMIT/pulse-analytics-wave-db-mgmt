const _ = require('lodash')

const PAYER_TOOL_ID = 'a3f419de-ca7d-4498-94dd-04fb9f6b8777'

module.exports = async ({ targetTeam, pulseDevDb, treatmentPlan }) => {
  const firstUser = targetTeam.users[0]
  if (!firstUser) throw new Error('Selected team must have at least one user')

  const firstUserId = firstUser._id

  const targetUser = await pulseDevDb
    .collection('users.nodes.resources')
    .findOne({ _id: firstUserId })

  const payerToolNodeResources = targetUser.resources.find(
    ({ nodeId }) => PAYER_TOOL_ID === nodeId
  )

  if (!payerToolNodeResources)
    throw new Error("Selected team doesn't have access to payer tool")

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

  const payersForSelectedTreatmentPlan = await pulseDevDb
    .collection('payerHistoricalCombinedData')
    .find({
      ...treatmentPlan,
      slug: { $in: permittedSlugs },
      $or: permittedIndRegCombos,
    })
    .toArray()

  if (_.isEmpty(payersForSelectedTreatmentPlan)) {
    throw new Error(
      'No quality of access data for selected treatment plan and role'
    )
  }

  return payersForSelectedTreatmentPlan
}
