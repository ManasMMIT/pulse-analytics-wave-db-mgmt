const {
  testContainer
} = require('./test-utils')
const additionalCriteriaTest = require('./additionalCriteriaManager.js')
const qualityOfAccessTest = require('./qualityOfAccessManager.js')
const policyLinksManager = require('./policyLinksManager.js')

testContainer(async (pulseCoreDb) => {
  await qualityOfAccessTest(pulseCoreDb)
  await additionalCriteriaTest(pulseCoreDb)
  await policyLinksManager(pulseCoreDb)
})
