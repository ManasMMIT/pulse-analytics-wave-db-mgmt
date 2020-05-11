const SheetToCore = require('../SheetToCore/ManagerFactory')
const {
  mockPolicyLinkData,
  mockTimestamp,
  mockProjectId,
  OTP_ID_1,
  OTP_ID_2,
  TEST_COLLECTION_NAME,
} = require('./importPayerHistoricalAccessData.mocks')
const assert = require('assert').strict
const {
  testContainer,
  runDbOps,
  SHEET_NAMES
} = require('./test-utils')

const testPolicyLinkManager = async (pulseCoreDb) => {
  try {
    console.log('Running Policy Links sheet manager test...')

    const plConfig = {
      projectId: mockProjectId,
      timestamp: mockTimestamp,
      pulseCore: pulseCoreDb,
      sheetData: mockPolicyLinkData,
      sheetName: SHEET_NAMES.pl,
    }

    const plSheetManager = new SheetToCore(plConfig).getManager(SHEET_NAMES.pl)

    // // Run Policy Links Test
    console.log('Upserting Policy Link Sheet...')
    await runDbOps(plSheetManager)

    const policyLinkDoc1 = await pulseCoreDb
      .collection(TEST_COLLECTION_NAME)
      .findOne({ 
        timestamp: plSheetManager.timestamp,
        orgTpId: OTP_ID_1
      })

    const policyLinkDoc2 = await pulseCoreDb
      .collection(TEST_COLLECTION_NAME)
      .findOne({ 
        timestamp: plSheetManager.timestamp,
        orgTpId: OTP_ID_2
      })

    // Test document upsertions
    assert.deepStrictEqual(policyLinkDoc1.timestamp, plSheetManager.timestamp)
    console.log('\u0009 Timestamp test passed \u2713')

    assert.deepStrictEqual(policyLinkDoc1.policyLinkData.link, mockPolicyLinkData[0].link)
    console.log('\u0009 Policy Link Doc 1 data matches mock policy link data \u2713')

    assert.deepStrictEqual(policyLinkDoc2.policyLinkData.link, mockPolicyLinkData[0].link)
    console.log('\u0009 Policy Link Doc 2 data matches mock policy link data \u2713')
  } catch (e) {
    throw new Error(e)
  }
}

if (require.main === module) testContainer(testPolicyLinkManager)

module.exports = testPolicyLinkManager

