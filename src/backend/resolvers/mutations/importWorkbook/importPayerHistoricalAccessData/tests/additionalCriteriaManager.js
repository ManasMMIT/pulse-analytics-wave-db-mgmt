const SheetToCore = require('../SheetToCore/ManagerFactory')
const {
  mockAdditionalCriteriaData,
  mockTimestamp,
  mockProjectId,
  OTP_ID_1,
  TEST_COLLECTION_NAME,
} = require('./importPayerHistoricalAccessData.mocks')
const assert = require('assert').strict
const {
  testContainer,
  runDbOps,
  SHEET_NAMES
} = require('./test-utils')

const testAdditionalCriteriaManager = async (pulseCoreDb) => {
  try {
    console.log('Running Additional Criteria sheet manager test...')

    const acConfig = {
      projectId: mockProjectId,
      timestamp: mockTimestamp,
      pulseCore: pulseCoreDb,
      sheetData: mockAdditionalCriteriaData,
      sheetName: SHEET_NAMES.ac,
    }

    const acSheetManager = new SheetToCore(acConfig).getManager(SHEET_NAMES.ac)

    // Run Additional Criteria Test
    console.log('Upserting Additional Criteria Sheet...')
    await runDbOps(acSheetManager)

    const additionalCriteriaDoc = await pulseCoreDb
      .collection(TEST_COLLECTION_NAME)
      .findOne({ 
        timestamp: acSheetManager.timestamp,
        orgTpId: OTP_ID_1
      })

    // Test document upsertions
    assert.deepStrictEqual(additionalCriteriaDoc.timestamp, acSheetManager.timestamp)
    console.log('\u0009 Timestamp test passed \u2713')

    assert.deepStrictEqual(additionalCriteriaDoc.additionalCriteriaData.length, 2)
    assert.deepStrictEqual(additionalCriteriaDoc.additionalCriteriaData[0].criteria, mockAdditionalCriteriaData[0].criteria)
    console.log('\u0009 Updated Additional Criteria Doc criteria value matches mock criteria value \u2713')
  } catch (e) {
    throw new Error(e)
  }
}

if (require.main === module) testContainer(testAdditionalCriteriaManager)

module.exports = testAdditionalCriteriaManager