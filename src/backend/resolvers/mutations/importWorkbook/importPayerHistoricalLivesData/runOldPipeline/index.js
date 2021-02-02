const pushSheetToCore = require('./pushSheetToCore')
const pushCoreToDev = require('./pushCoreToDev')

const OLD_CORE_COLLECTION_NAMES = {
  National: {
    DRG: 'payerHistoricalDrgNationalLives',
    MMIT: 'payerHistoricalMmitNationalLives',
  },
  'U.S. State': {
    DRG: 'payerHistoricalDrgStateLives',
    MMIT: 'payerHistoricalMmitStateLives',
  },
}

const runOldPipeline = async ({
  timestamp,
  territoryType,
  source,
  data,
  dbsConfig: { pulseCoreDb, pulseDevDb, mongoClient },
}) => {
  const collectionName = OLD_CORE_COLLECTION_NAMES[territoryType][source]
  const month = timestamp.getMonth() + 1
  const year = timestamp.getFullYear()
  const createdOn = new Date()

  const formattedData = data.map((datum) => ({
    ...datum,
    createdOn,
    month,
    year,
  }))

  await pushSheetToCore({
    collectionName,
    month,
    year,
    formattedData,
    pulseCoreDb,
    mongoClient,
  })

  // ! This op has side-effects that involve totaling up lives and replacing
  // ! 4 corresponding collections on pulse-core;
  // ! payerDrgNationalLivesTotals, payerMmitStateLivesTotals, etc.
  await pushCoreToDev({
    collectionName,
    pulseCoreDb,
    pulseDevDb,
    mongoClient,
  })
}

module.exports = runOldPipeline
