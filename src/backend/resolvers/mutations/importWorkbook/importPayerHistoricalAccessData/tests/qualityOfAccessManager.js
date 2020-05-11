const SheetToCore = require('../SheetToCore/ManagerFactory')
const {
  mockQOAData,
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

const testQualityOfAccessManager = async (pulseCoreDb) => {
  try {
    console.log('Running Quality of Access sheet manager test...')

    const qoaConfig = {
      projectId: mockProjectId,
      timestamp: mockTimestamp,
      pulseCore: pulseCoreDb,
      sheetData: mockQOAData,
      sheetName: SHEET_NAMES.qoa,
    }

    const qoaSheetManager = new SheetToCore(qoaConfig).getManager(SHEET_NAMES.qoa)

    // Run QOA Test
    console.log('Upserting Quality of Access Sheet...')
    await runDbOps(qoaSheetManager)

    const qoaDoc = await pulseCoreDb
      .collection(TEST_COLLECTION_NAME)
      .findOne({ 
        timestamp: qoaSheetManager.timestamp,
        orgTpId: OTP_ID_1
      })

    // Test document upsertions
    assert.deepStrictEqual(qoaDoc.timestamp, qoaSheetManager.timestamp)
    console.log('\u0009 Timestamp test passed \u2713')

    assert.deepStrictEqual(qoaDoc.accessData.access, mockQOAData[0].access)
    console.log('\u0009 Updated Quality of Access Doc access value matches mock access value \u2713')

    // return Promise.resolve('Test ended')
  } catch (e) {
    console.error(e)
    throw new Error(e)
  }
}

if (require.main === module) testContainer(testQualityOfAccessManager)

module.exports = testQualityOfAccessManager

