const connectToMongoDb = require('../../../../../../connect-to-mongodb')
const deleteTreatmentPlansCascade = require('../deleteTreatmentPlansCascade')

let mongoConnection

describe('Cascade Delete', () => {
  jest.setTimeout(60000) // ! needed to adjust jest timeout for slower connections

  beforeAll(async () => {
    mongoConnection = await connectToMongoDb()
  })

  test('Cascade deleting Treatment Plans removes required docs', async () => {
    const pulseCore = mongoConnection.db('pulse-core')

    try {
      const session = mongoConnection.startSession()

      await session.withTransaction(async () => {
        // ! we want to test the entire cascade, so the tpIds should exist in history
        const testOrgTpHistoryDocs = await pulseCore
          .collection('organizations.treatmentPlans.history')
          .find({}, { session }) // ! might break even with limit
          .limit(4) // ! this pool doesn't necessarily consist of unique treatmentPlanIds; that's ok for now
          .toArray()

        const testTpIds = testOrgTpHistoryDocs.map(({ treatmentPlanId }) => treatmentPlanId)

        console.log('Test tps to check: ', testTpIds.join(', '))

        await deleteTreatmentPlansCascade({
          db: pulseCore,
          treatmentPlanIds: testTpIds,
          session,
        })

        // ! Test org tp deletion success.

        const orgTpDocs = await pulseCore
          .collection('organizations.treatmentPlans')
          .find(
            {
              treatmentPlanId: { $in: testTpIds }
            },
            { session }
          )
          .toArray()

        expect(orgTpDocs.length).toBe(0)
        console.log(
          'Organization TreatmentPlan docs successfully deleted: ',
          orgTpDocs.length === 0,
        )

        // ! Test org tp history delete success.

        const orgTpHistDocs = await pulseCore
          .collection('organizations.treatmentPlans.history')
          .find(
            {
              treatmentPlanId: { $in: testTpIds }
            },
            { session }
          )
          .toArray()

        expect(orgTpHistDocs.length).toBe(0)
        console.log(
          'Organization TreatmentPlan History docs successfully deleted: ',
          orgTpHistDocs.length === 0,
        )

        // ! Test tp delete success.

        const tPDocs = await pulseCore
          .collection('treatmentPlans')
          .find(
            {
              _id: { $in: testTpIds }
            },
            { session }
          )
          .toArray()

        expect(tPDocs.length).toBe(0)
        console.log(
          'TreatmentPlan docs successfully deleted: ',
          tPDocs.length === 0,
        )

        throw new Error('Success. Cascade Treatment Plan deletion test ran to end.')
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
