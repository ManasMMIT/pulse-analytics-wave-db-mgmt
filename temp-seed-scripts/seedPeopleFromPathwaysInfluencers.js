const connectToMongoDb = require('../connect-to-mongodb')
const _ = require('lodash')
const { ObjectId } = require('mongodb')
const getMaterializationAggPipeline = require('../src/backend/resolvers/mutations/relationalResolvers/pathwaysAndPerson/getMaterializationAggPipeline')

const JOIN_PEOPLE_COLLECTION = 'TEMP_JOIN_pathways_people'
const PEOPLE_COLLECTION = 'TEMP_people'
const TEMP_MATERIALIZED_COLLECTION = 'TEMP_pathwaysInfluencers_2'
const EVENTS_COLLECTIONS = 'TEMP_events'
const SOURCE_COLLECTION = 'RAW_pathwaysInfluencers'

const cleanCollections = async ({ pulseCoreDb, pulseDevDb }) => {
  console.log('Remove All JOIN_pathways_people documents...')
  await pulseCoreDb.collection(JOIN_PEOPLE_COLLECTION)
    .deleteMany()

  console.log('Remove All TEMP_pathwaysInfluencers collection...')
  await pulseDevDb.collection(TEMP_MATERIALIZED_COLLECTION)
    .deleteMany()

  console.log('Remove All Pathways People documents from People collection...')
  await pulseCoreDb.collection(PEOPLE_COLLECTION).deleteMany({
    isPathwaysPeople: true
  })

  console.log('Reset the core events collections (otherwise old, non-applicable events will be there)')
  await pulseCoreDb.collection(EVENTS_COLLECTIONS)
    .deleteMany()
}

const getSeedOps = ({
  pulseCoreDb,
  pulseDevDb,
  keyedIndicationsByName,
}) => async datum => {
  const {
    personId,
    npiNumber,
    firstName,
    middleName,
    lastName,
    affiliation,
    affiliationPosition,
    primaryState,
    managementType,
    influencerType,
    slug,
    title,
    indication,
    indicationCategory,
    priority,
    chairIndications,
    startDate,
    startQuarter,
    endQuarter,
    outdated,
    exclusionSettings,
    alertDate,
    alertDescription,
    disclosureTotal,
    disclosureDate1,
    disclosureDate2,
    disclosureDate3,
    disclosureDate4,
    internalNote,
    source,
    contact,
    internalRole,
  } = datum

  let joinPersonId = ObjectId(personId)
  const fullName = `${ firstName } ${ middleName } ${ lastName }`

  // Step 4a: See if person with personId already exists (anyone with a personId will most likely already be in the DB)
  const personWithId = await pulseCoreDb.collection(PEOPLE_COLLECTION)
    .findOne({ _id: joinPersonId })
  const personWithNpi = await pulseCoreDb.collection(PEOPLE_COLLECTION)
    .findOne({ nationalProviderIdentifier: Number(npiNumber) })

  const pathwaysOrg = await pulseCoreDb.collection('organizations')
    .findOne({ type: 'Pathways', slug })

  const indicationIds = []

  indication.forEach(indicationName => {
    const indicationIdObj = keyedIndicationsByName[indicationName]
    if (indicationIdObj) indicationIds.push(indicationIdObj._id)
  })

  if (personWithNpi) joinPersonId = personWithNpi._id

  // Step 4b: Insert the person if it doesn't already exist in the people collection
  if (personWithId === null && personWithNpi === null) {
    const insertedObj = await pulseCoreDb.collection(PEOPLE_COLLECTION)
      .insertOne({
        _id: ObjectId(),
        firstName,
        lastName,
        middleName,
        affiliation,
        affiliationPosition,
        primaryState,
        nationalProviderIdentifier: npiNumber ? Number(npiNumber) : null,
        createdOn: new Date(),
        updatedOn: new Date(),
        isPathwaysPeople: true // flag to differentiate the injected people
      })
    
    joinPersonId = insertedObj.insertedId
    console.log(`Inserted Person of ${ fullName } into people collection`)
  }

  const joinDocId = ObjectId()
  const joinPathwaysPeopleDoc = {
    _id: joinDocId,
    personId: joinPersonId,
    pathwaysId: pathwaysOrg._id,
    indicationIds,
    pathwaysInfluencerTypes: influencerType,
    tumorTypeSpecialty: indicationCategory,
    position: title,
    priority,
    startDate,
    startQuarter,
    endDate: outdated,
    endQuarter,
    source,
    contact,
    internalRole,
    internalFields: {
      internalNotes: internalNote,
      pathwaysManagementTypes: managementType,
      valueChairsIndications: chairIndications,
      totalDisclosures: disclosureTotal,
      dateDisclosure1: disclosureDate1,
      dateDisclosure2: disclosureDate2,
      dateDisclosure3: disclosureDate3,
      dateDisclosure4: disclosureDate4,
    },
    alert: {
      date: alertDate,
      type: 'Influencer',
      description: alertDescription,
    },
    exclusionSettings: {
      isExcluded: Boolean(exclusionSettings),   
      reason: exclusionSettings,
    },
  }

  // Step 4c: Insert the join document associated with the person
  await pulseCoreDb.collection(JOIN_PEOPLE_COLLECTION)
    .insertOne(joinPathwaysPeopleDoc)

  console.log(`Inserted Join Doc for ${ joinDocId }`)

  const shouldSkipMaterialization = joinPathwaysPeopleDoc.exclusionSettings.isExcluded

  // Step 4d: Materialize Temp Pathways Inflluencers on pulse-dev unless isExcluded is truthy
  if (shouldSkipMaterialization) {
    console.log(`Doc for ${joinDocId} skipped because isExcluded truthy`) 
  } else {
    const materializedDoc = await pulseCoreDb
      .collection(JOIN_PEOPLE_COLLECTION)
      .aggregate(
        getMaterializationAggPipeline({
          $match: { _id: joinDocId },
        })
      )
      .next()

    await pulseDevDb
      .collection(TEMP_MATERIALIZED_COLLECTION)
      .insertOne(materializedDoc)
  }
}

const seedPeopleFromPathwaysInfluencers = async () => {
  const dbs = await connectToMongoDb()
  const pulseCoreDb = dbs.db('pulse-core')
  const pulseDevDb = dbs.db('pulse-dev')

  const dbConfig = {
    pulseCoreDb,
    pulseDevDb,
  }

  try {
    // Step 1: Clean/Reset all collections
    await cleanCollections({ ...dbConfig })

    // Step 2: Find all influencers that needs to be seeded
    const pathwaysInfluencers = await pulseDevDb.collection(SOURCE_COLLECTION)
      .find({ type: 'Pathways' }) // Extra check in case there are blank types
      .toArray()

    // Step 3: Create indication key map
    const indications = await pulseCoreDb.collection('indications')
      .find()
      .toArray()
    const keyedIndicationsByName = _.keyBy(indications, 'name')

    // Step 4:. Create DB Seed Ops
    const seedOpsCallback = getSeedOps({ ...dbConfig, keyedIndicationsByName })
    const ops = pathwaysInfluencers.map(seedOpsCallback)
  
    // Step 5. Execute DB Seed Ops
    await Promise.all(ops)
  } catch (e) {
    console.log(e)
  } finally {
    await dbs.close()
  }
}

seedPeopleFromPathwaysInfluencers().then(() => {
  console.log('Script finished')
  process.exit()
})

