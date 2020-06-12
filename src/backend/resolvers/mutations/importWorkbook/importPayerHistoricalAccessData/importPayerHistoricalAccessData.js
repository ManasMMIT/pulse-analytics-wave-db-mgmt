const { ObjectId } = require('mongodb')
const { zonedTimeToUtc } = require('date-fns-tz')

const SheetToCoreManager = require('./SheetToCore/ManagerFactory')
const SheetToCoreManagerDao = require('./SheetToCore/ManagerFactory/ManagerDao')

const CoreToDev = require('./CoreToDev')

const DEFAULT_TIMEZONE = require('../../../../utils/defaultTimeZone')

const {
  validateQualityOfAccess,
  validateAdditionalCriteria,
  validatePolicyLinks,
} = require('./SheetToCore/validatePayerHistoricalAccessData')

const {
  getProjectOrgTpsEnrichedPipeline,
} = require('./SheetToCore/agg-pipelines')

const {
  isQualityAccessSheet,
  isAdditionalCriteriaSheet,
  isPolicyLinksSheet,
  getValidationComboHash,
} = require('./utils')

const importPayerHistoricalAccessData = async ({
  cleanedSheetsWithMetadata,
  dbsConfig: { pulseCoreDb, pulseDevDb, mongoClient },
  importFeedback,
}) => {

  console.time('Step 2: QOA Combo Validation')
  // STEP 1: Get the project's PTPs; it's going to be used throughout this process
  let [{ projectId, timestamp: importTimestamp }] = cleanedSheetsWithMetadata
  projectId = ObjectId(projectId)

  const projectPtps = await pulseCoreDb
    .collection('tdgProjects')
    .aggregate(getProjectOrgTpsEnrichedPipeline(projectId))
    .toArray()

  // STEP 2: Validate all the sheets; if there's anything wrong, error and stop the code
  for (const sheetObjWithMetadata of cleanedSheetsWithMetadata) {
    let { sheet: sheetName, data } = sheetObjWithMetadata

    if (isQualityAccessSheet(sheetName)) {
      const strictlyRequiredPtps = getValidationComboHash(projectPtps, 'ptps')
      validateQualityOfAccess({ sheetData: data, strictlyRequiredPtps })
    } else if (isAdditionalCriteriaSheet(sheetName)) {
      const allowedPtps = getValidationComboHash(projectPtps, 'ptps')
      validateAdditionalCriteria({ sheetData: data, allowedPtps })
    } else if (isPolicyLinksSheet(sheetName)) {
      const allowedBrcs = getValidationComboHash(projectPtps, 'brcs')
      validatePolicyLinks({ sheetData: data, allowedBrcs })
    }
  }

  console.timeEnd('Step 2: QOA Combo Validation')

  const session = mongoClient.startSession()
  
  await session.withTransaction(async () => {

    console.time('Step 3: Clear PTP-timestamp combos')
    // STEP 3: Clear the PTP-timestamp combos before any upsertion happens
    const convertedTimestamp = zonedTimeToUtc(importTimestamp, DEFAULT_TIMEZONE)
    const projectPtpIds = projectPtps.map(({ _id }) => _id)

    await pulseCoreDb.collection('organizations.treatmentPlans.history')
      .updateMany(
        {
          timestamp: convertedTimestamp,
          orgTpId: { $in: projectPtpIds },
        },
        {
          $set: {
            policyLinkData: {},
            additionalCriteriaData: [],
            accessData: {},
            tierData: {},
          }
        },
        {
          session,
        }
      )

    console.timeEnd('Step 3: Clear PTP-timestamp combos')

    // STEP 4: Upsert all the sheets
    for (const sheetObjWithMetadata of cleanedSheetsWithMetadata) {
      let {
        wb,
        sheet: sheetName,
        data,
        timestamp,
        projectId,
        skippedRows,
        originalDataLength,
      } = sheetObjWithMetadata

      const timerLabel = `Step 4: Upsertion - ${ sheetName }`
      console.time(timerLabel)

      projectId = ObjectId(projectId)

      const projectConfig = {
        sheetData: data,
        timestamp,
        projectId,
        pulseCore: pulseCoreDb,
      }

      const sheetManagerFactory = new SheetToCoreManager(projectConfig)
      const sheetManager = sheetManagerFactory.getManager(sheetName)
      const sheetManagerDao = new SheetToCoreManagerDao({ db: pulseCoreDb })

      sheetManager.setEnrichedPtpsByCombination(projectPtps)

      if (isQualityAccessSheet(sheetName)) {
        const accessData = await sheetManagerDao.getAccessesOp()
        sheetManager.setQualityOfAccessHash(accessData)
      }

      const permittedOps = sheetManager.getPermittedOps()
      await sheetManagerDao.upsertOrgTpHistory(permittedOps, session)

      console.timeEnd(timerLabel)

      importFeedback.push(
        `Import to CORE successful for ${wb}/${sheetName}`
        + `\n${data.length}/${originalDataLength} rows imported (excluding header)`
        + `\nSkipped rows were: ${skippedRows.join(', ')}`
      )
    }
  })

  // STEP 5: Materialize payer historical access data, CoreToDev
  const coreToDev = new CoreToDev({
    pulseDev: pulseDevDb,
    pulseCore: pulseCoreDb,
  })

  // HOTFIX: await is removed so that the response does not timeout while it waits for data to materialize
  coreToDev.materializeNonLivesCollections()

  importFeedback.push('Payer historical access data successfully materialized to dev')
  
  return 'Success'
}

module.exports = importPayerHistoricalAccessData
