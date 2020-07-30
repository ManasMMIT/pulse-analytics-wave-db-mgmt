const connectToTestCluster = require('../../../../utils/connectToTestCluster')
const deleteTreatmentPlansCascade = require('../deleteTreatmentPlansCascade')

let mongoConnection

describe('Cascade Delete', () => {
  jest.setTimeout(60000) // ! needed to adjust jest timeout for slower connections

  beforeAll(async () => {
    mongoConnection = await connectToTestCluster()
  })

  test('Cascade deleting Treatment Plans removes required docs', async () => {
    const pulseCoreDb = mongoConnection.db('pulse-core')
    const pulseDevDb = mongoConnection.db('pulse-dev')

    try {
      const session = mongoConnection.startSession()

      await session.withTransaction(async () => {
        // ! we want to test the entire cascade, so start from PTPs in the tdgProjects,
        // ! grab some treatment plans, and start the cascade from there
        const testStartingProject = await pulseCoreDb
          .collection('tdgProjects')
          .findOne({ 'orgTpIds.0': { $exists: true } }, { session })

        if (!testStartingProject) {
          throw new Error('No projects with at least one orgTpId found')
        }

        const testOrgTpIds = testStartingProject.orgTpIds.slice(0, 5)

        const testOrgTpHistoryDocs = await pulseCoreDb
          .collection('organizations.treatmentPlans')
          .find({ _id: { $in: testOrgTpIds } }, { session })
          .toArray()

        const testTpIds = testOrgTpHistoryDocs.map(
          ({ treatmentPlanId }) => treatmentPlanId
        )

        if (!testTpIds.length) {
          throw new Error('No testTpIds found for test to run')
        }

        console.log('Test tps to check: ', testTpIds.join(', '))

        await deleteTreatmentPlansCascade({
          pulseCoreDb,
          pulseDevDb,
          treatmentPlanIds: testTpIds,
          session,
        })

        // ! Test org tp deletion success.

        const orgTpDocs = await pulseCoreDb
          .collection('organizations.treatmentPlans')
          .find(
            {
              treatmentPlanId: { $in: testTpIds },
            },
            { session }
          )
          .toArray()

        expect(orgTpDocs.length).toBe(0)
        console.log(
          'Organization TreatmentPlan docs successfully deleted: ',
          orgTpDocs.length === 0
        )

        // ! Test org tp history delete success.

        const orgTpHistDocs = await pulseCoreDb
          .collection('organizations.treatmentPlans.history')
          .find(
            {
              treatmentPlanId: { $in: testTpIds },
            },
            { session }
          )
          .toArray()

        expect(orgTpHistDocs.length).toBe(0)
        console.log(
          'Organization TreatmentPlan History docs successfully deleted: ',
          orgTpHistDocs.length === 0
        )

        // ! Test tp delete success.

        const tPDocs = await pulseCoreDb
          .collection('treatmentPlans')
          .find(
            {
              _id: { $in: testTpIds },
            },
            { session }
          )
          .toArray()

        expect(tPDocs.length).toBe(0)
        console.log(
          'TreatmentPlan docs successfully deleted: ',
          tPDocs.length === 0
        )

        // ! Test tdgProjects deletion success

        const tdgProjectsDocs = await pulseCoreDb
          .collection('tdgProjects')
          .find(
            {
              $or: [
                { orgTpId: { $in: testOrgTpIds } },
                { extraOrgTpId: { $in: testOrgTpIds } },
              ],
            },
            { session }
          )
          .toArray()

        expect(tdgProjectsDocs.length).toBe(0)
        console.log(
          'Payer treatment plans in tdgProjects successfully removed: ',
          tdgProjectsDocs.length === 0
        )

        // ! Test pulse-dev.payerLatestAccess deletion success

        const payerLatestAccessDocs = await pulseDevDb
          .collection('payerLatestAccess')
          .find(
            {
              treatmentPlanId: { $in: testTpIds },
            },
            { session }
          )
          .toArray()

        expect(payerLatestAccessDocs.length).toBe(0)
        console.log(
          'Payer treatment plans in pulse-dev.payerLatestAccess successfully removed: ',
          payerLatestAccessDocs.length === 0
        )

        // ! Test pulse-dev.payerHistoricalAccess deletion success

        const payerHistoricalAccessDocs = await pulseDevDb
          .collection('payerHistoricalAccess')
          .find(
            {
              treatmentPlanId: { $in: testTpIds },
            },
            { session }
          )
          .toArray()

        expect(payerHistoricalAccessDocs.length).toBe(0)
        console.log(
          'Payer treatment plans in pulse-dev.payerHistoricalAccessDocs successfully removed: ',
          payerHistoricalAccessDocs.length === 0
        )

        throw new Error(
          'Success. Cascade Treatment Plan deletion test ran to end.'
        )
      })
    } catch (e) {
      await mongoConnection.close()

      const wasThrownOnPurpose = /Success/g.test(e)

      if (!wasThrownOnPurpose) {
        throw e
      }
    }
  })
})
