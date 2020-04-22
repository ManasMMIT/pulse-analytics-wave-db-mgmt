require('dotenv').config()
const MONGO_KEY = process.env.MONGO_KEY
const MongoClient = require('mongodb').MongoClient

const getDiffDoc = require('./getDiffDocFunc')
const _ = require('lodash')

// TODO

// ! CORE
// payerDrgNationalLivesTotals
// payerDrgStateLivesTotals
// payerMmitNationalLivesTotals
// payerMmitStateLivesTotals

// ! DEV
// payerHistoricalDrgNationalLives
// payerHistoricalDrgStateLives
// payerHistoricalMmitNationalLives
// payerHistoricalMmitStateLives

const coreNationalTotalsComparer = ({
  federalOtherPharmacy,
  macMedical,
  commercialMedical,
  ffsMedicaidMedical,
  medicareMedical,
  managedMedicaidMedical,
  federalOtherMedical,
  commercialPharmacy,
  medicarePharmacy,
  managedMedicaidPharmacy,
  ffsMedicaidPharmacy,
}) => [
    federalOtherPharmacy,
    macMedical,
    commercialMedical,
    ffsMedicaidMedical,
    medicareMedical,
    managedMedicaidMedical,
    federalOtherMedical,
    commercialPharmacy,
    medicarePharmacy,
    managedMedicaidPharmacy,
    ffsMedicaidPharmacy,
].join('|')

// ! For now, let's see at a higher level what's wrong
const coreStateTotalsComparer = ({
  state,
  // stateLong,
  medicareMedical,
  // totalMedical,
  commercialPharmacy,
  // totalPharmacy,
  commercialMedical,
  managedMedicaidPharmacy,
  ffsMedicaidMedical,
  managedMedicaidMedical,
  macMedical,
  federalOtherMedical,
  medicarePharmacy,
  ffsMedicaidPharmacy,
  federalOtherPharmacy,
}) => [
    state,
    // stateLong,
    medicareMedical,
    // totalMedical,
    commercialPharmacy,
    // totalPharmacy,
    commercialMedical,
    managedMedicaidPharmacy,
    ffsMedicaidMedical,
    managedMedicaidMedical,
    macMedical,
    federalOtherMedical,
    medicarePharmacy,
    ffsMedicaidPharmacy,
    federalOtherPharmacy,
].join('|')

const devHistoricalNationalLivesComparer = ({
  commercialMedical,
  commercialPharmacy,
  federalOtherMedical,
  federalOtherPharmacy,
  ffsMedicaidMedical,
  ffsMedicaidPharmacy,
  macMedical,
  managedMedicaidMedical,
  managedMedicaidPharmacy,
  medicareMedical,
  medicarePharmacy,
  month,
  // organization,
  // organizationTiny,
  slug,
  year,
  // structuredLives, // ! NO
}) => [
    commercialMedical,
    commercialPharmacy,
    federalOtherMedical,
    federalOtherPharmacy,
    ffsMedicaidMedical,
    ffsMedicaidPharmacy,
    macMedical,
    managedMedicaidMedical,
    managedMedicaidPharmacy,
    medicareMedical,
    medicarePharmacy,
    month,
    // organization,
    // organizationTiny,
    slug,
    year,
].join('|')

const devHistoricalStateLivesComparer = ({
  commercialMedical,
  commercialPharmacy,
  federalOtherMedical,
  federalOtherPharmacy,
  ffsMedicaidMedical,
  ffsMedicaidPharmacy,
  macMedical,
  managedMedicaidMedical,
  managedMedicaidPharmacy,
  medicareMedical,
  medicarePharmacy,
  month,
  // organization,
  slug,
  state,
  // stateLong,
  year,
  // totalMedical,
  // totalPharmacy,
}) => [
  commercialMedical,
  commercialPharmacy,
  federalOtherMedical,
  federalOtherPharmacy,
  ffsMedicaidMedical,
  ffsMedicaidPharmacy,
  macMedical,
  managedMedicaidMedical,
  managedMedicaidPharmacy,
  medicareMedical,
  medicarePharmacy,
  month,
  // organization,
  slug,
  state,
  // stateLong,
  year,
  // totalMedical,
  // totalPharmacy,
].join('|')

const runDiffer = async () => {
  const stagingDbs = await MongoClient.connect(`mongodb://pulse-admin:${MONGO_KEY}@wave-staging-shard-00-00-ik4h2.mongodb.net:27017,wave-staging-shard-00-01-ik4h2.mongodb.net:27017,wave-staging-shard-00-02-ik4h2.mongodb.net:27017/pulse-dev?ssl=true&replicaSet=wave-staging-shard-0&authSource=admin`, { useUnifiedTopology: true })
  // const controlDbs = await MongoClient.connect(`mongodb://pulse-admin:${MONGO_KEY}@wave-shard-00-00-ik4h2.mongodb.net:27017,wave-shard-00-01-ik4h2.mongodb.net:27017,wave-shard-00-02-ik4h2.mongodb.net:27017/pulse-dev?ssl=true&replicaSet=wave-shard-0&authSource=admin`, { useUnifiedTopology: true })

  const pulseDevStaging = stagingDbs.db('pulse-dev')
  const pulseCoreStaging = stagingDbs.db('pulse-core')

  await pulseCoreStaging
    .collection('aBHistoricalLivesDiffsAll')
    .deleteMany()

  await pulseCoreStaging
    .collection('aBHistoricalLivesDiffs')
    .deleteMany()

  const corePayerDrgNationalLivesTotalsDiffs = await getDiffDoc({
    db: pulseCoreStaging,
    collectionName: 'payerDrgNationalLivesTotals',
    comparer: coreNationalTotalsComparer,
  })

  const corePayerMmitNationalLivesTotalsDiffs = await getDiffDoc({
    db: pulseCoreStaging,
    collectionName: 'payerMmitNationalLivesTotals',
    comparer: coreNationalTotalsComparer,
  })

  const corePayerDrgStateLivesTotalsDiffs = await getDiffDoc({
    db: pulseCoreStaging,
    collectionName: 'payerDrgStateLivesTotals',
    comparer: coreStateTotalsComparer,
  })

  const corePayerMmitStateLivesTotalsDiffs = await getDiffDoc({
    db: pulseCoreStaging,
    collectionName: 'payerMmitStateLivesTotals',
    comparer: coreStateTotalsComparer,
  })

  const devPayerHistoricalDrgNationalLives = await getDiffDoc({
    db: pulseDevStaging,
    collectionName: 'payerHistoricalDrgNationalLives',
    comparer: devHistoricalNationalLivesComparer,
  })

  const devPayerHistoricalMmitNationalLives = await getDiffDoc({
    db: pulseDevStaging,
    collectionName: 'payerHistoricalMmitNationalLives',
    comparer: devHistoricalNationalLivesComparer,
  })

  const devPayerHistoricalDrgStateLives = await getDiffDoc({
    db: pulseDevStaging,
    collectionName: 'payerHistoricalDrgStateLives',
    comparer: devHistoricalStateLivesComparer,
  })

  const devPayerHistoricalMmitStateLives = await getDiffDoc({
    db: pulseDevStaging,
    collectionName: 'payerHistoricalMmitStateLives',
    comparer: devHistoricalStateLivesComparer,
  })

debugger
  await pulseCoreStaging
    .collection('aBHistoricalLivesDiffs')
    .insertMany([
      corePayerDrgNationalLivesTotalsDiffs.simpleDiff,
      corePayerMmitNationalLivesTotalsDiffs.simpleDiff,
      corePayerDrgStateLivesTotalsDiffs.simpleDiff,
      corePayerMmitStateLivesTotalsDiffs.simpleDiff,
      devPayerHistoricalDrgNationalLives.simpleDiff,
      devPayerHistoricalMmitNationalLives.simpleDiff,
      devPayerHistoricalDrgStateLives.simpleDiff,
      devPayerHistoricalMmitStateLives.simpleDiff,
    ])

  await pulseCoreStaging
    .collection('aBHistoricalLivesDiffsAll')
    .insertMany([
      corePayerDrgNationalLivesTotalsDiffs.diff,
      corePayerMmitNationalLivesTotalsDiffs.diff,
      corePayerDrgStateLivesTotalsDiffs.diff,
      corePayerMmitStateLivesTotalsDiffs.diff,
      devPayerHistoricalDrgNationalLives.diff,
      devPayerHistoricalMmitNationalLives.diff,
      devPayerHistoricalDrgStateLives.diff,
      devPayerHistoricalMmitStateLives.diff,
    ])

  console.log('DONE')

  debugger

  await stagingDbs.close()

  console.log('dbs connection closed')
}

runDiffer()
