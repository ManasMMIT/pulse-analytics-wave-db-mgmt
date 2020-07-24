const getTrashPipeline = require('./getTrashPipeline')

module.exports = async ({
  pulseCoreDb,
  pulseDevDb,
  session,
  treatmentPlanIds,
}) => {
  if (!session)
    throw new Error('Session not passed to Delete Treatment Plans Cascade Ops')

  // STEP 1: find all `organizations.treatmentPlans` docs for all `treatmentPlan`s
  const orgTps = await pulseCoreDb
    .collection('organizations.treatmentPlans')
    .find(
      {
        treatmentPlanId: { $in: treatmentPlanIds },
      },
      { session }
    )
    .toArray()

  const orgTpIds = orgTps.map(({ _id }) => _id)

  // STEP 2: delete the PTPs from the tdgProjects collection
  await pulseCoreDb.collection('tdgProjects').updateMany(
    {},
    {
      $pull: {
        orgTpIds: { $in: orgTpIds },
        extraOrgTpIds: { $in: orgTpIds },
      },
    },
    { session }
  )

  // STEP 3: delete `organizations.treatmentPlans` docs for each to-be-deleted `treatmentPlan`
  await pulseCoreDb.collection('organizations.treatmentPlans').deleteMany(
    {
      treatmentPlanId: { $in: treatmentPlanIds },
    },
    { session }
  )

  // STEP 4: Get enriched trash docs
  const uncleanTrashDocs = await pulseCoreDb
    .collection('organizations.treatmentPlans.history')
    .aggregate(getTrashPipeline(treatmentPlanIds), {
      allowDiskUse: true,
      session,
    })
    .toArray()

  // STEP 5: delete `organizations.treatmentPlans.history` docs for each deleted `treatmentPlan`
  await pulseCoreDb
    .collection('organizations.treatmentPlans.history')
    .deleteMany(
      {
        treatmentPlanId: { $in: treatmentPlanIds },
      },
      { session }
    )

  // STEP 6: delete actual treatmentPlans
  await pulseCoreDb
    .collection('treatmentPlans')
    .deleteMany({ _id: { $in: treatmentPlanIds } }, { session })

  // STEP 7: delete all connected docs from dev materialized collections
  await Promise.all([
    pulseDevDb
      .collection('payerLatestAccess')
      .deleteMany({ treatmentPlanId: { $in: treatmentPlanIds } }, { session }),
    pulseDevDb
      .collection('payerHistoricalAccess')
      .deleteMany({ treatmentPlanId: { $in: treatmentPlanIds } }, { session }),
  ])

  // STEP 8: add deleted `organizations.treatmentPlans.history` docs (now enriched) to trash
  const cleanTrashDocs = uncleanTrashDocs.map(({ _id, ...doc }) => doc)

  if (cleanTrashDocs.length) {
    await pulseCoreDb
      .collection('trash.organizations.treatmentPlans.history')
      .insertMany(
        cleanTrashDocs,
        // ! session previously broke when used in indication or regimen deletion, due to large number of writes. Need to check if we can keep this in-session with mongo v4.2
        { session }
      )
  }
}
