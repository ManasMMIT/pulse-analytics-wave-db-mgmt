const getTrashPipeline = require('./getTrashPipeline')

module.exports = async ({
  db,
  session,
  treatmentPlanIds,
}) => {
  if (!session) throw new Error('Session not passed to Delete Treatment Plans Cascade Ops')

  // STEP 1: delete `organizations.treatmentPlans` docs for each deleted `treatmentPlan`
  await db
    .collection('organizations.treatmentPlans')
    .deleteMany(
      {
        treatmentPlanId: { $in: treatmentPlanIds },
      },
      { session },
    )

  // Step 2: Get enriched trash docs
  const uncleanTrashDocs = await db
    .collection('organizations.treatmentPlans.history')
    .aggregate(
      getTrashPipeline(treatmentPlanIds),
      { allowDiskUse: true, session },
    )
    .toArray()

  // STEP 3: delete `organizations.treatmentPlans.history` docs for each deleted `treatmentPlan`
  await db.collection('organizations.treatmentPlans.history')
    .deleteMany(
      {
        treatmentPlanId: { $in: treatmentPlanIds },
      },
      { session },
    )

  // STEP 4: delete actual treatmentPlans
  await db.collection('treatmentPlans')
    .deleteMany(
      { _id: { $in: treatmentPlanIds } },
      { session },
    )

  // STEP 5: add deleted `organizations.treatmentPlans.history` docs (now enriched) to trash
  const cleanTrashDocs = uncleanTrashDocs
    .map(({ _id, ...doc }) => doc)

  if (cleanTrashDocs.length) {
    await db
      .collection('trash.organizations.treatmentPlans.history')
      .insertMany(
        cleanTrashDocs,
        // ! session previously broke when used in indication or regimen deletion, due to large number of writes. Need to check if we can keep this in-session with mongo v4.2
        { session },
      )
  }
}
