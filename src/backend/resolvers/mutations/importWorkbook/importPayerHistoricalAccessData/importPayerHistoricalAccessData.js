const { ObjectId } = require('mongodb')

const SheetToCoreManager = require('./SheetToCore/ManagerFactory')
const SheetToCoreManagerDao = require('./SheetToCore/ManagerFactory/ManagerDao')

// const CoreToDev = require('./CoreToDev')

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
  // STEP 1: Get the project's PTPs; it's going to be used throughout this process
  let [{ projectId }] = cleanedSheetsWithMetadata
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

  // STEP 3: Upsert all the sheets
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

    if (isQualityAccessSheet) {
      const setQualityOfAccesses = await sheetManagerDao.getAccessesOp()
      sheetManager.setQualityOfAccessHash(setQualityOfAccesses)
    }

    const permittedOps = sheetManager.getPermittedOps()
    await sheetManagerDao.upsertOrgTpHistory(permittedOps)

    importFeedback.push(
      `Import to CORE successful for ${wb}/${sheetName}`
      + `\n${data.length}/${originalDataLength} rows imported (excluding header)`
      + `\nSkipped rows were: ${skippedRows.join(', ')}`
    )
  }

  // STEP 4: Materialize payer historical access data, CoreToDev
  // const coreToDev = new CoreToDev({
  //   pulseDev: pulseDevDb,
  //   pulseCore: pulseCoreDb,
  // })

  // await coreToDev.materializeNonLivesCollections()

  // importFeedback.push('Payer historical access data successfully materialized to dev')

  return 'Success'
}

module.exports = importPayerHistoricalAccessData
