const connectToMongoDb = require('../connect-to-mongodb')
const _ = require('lodash')
const { ObjectId } = require('mongodb')

  /*
   * Steps to Follow:
   * 1. Make sure the people collection is at a baseline (Sync it with the production cluster)'
   * - You can export a json version of the people collection in prod and replace what's existing in the people collection on staging
   * 2. Run the script
   * - The script will fetch the documents from the "RAW_pathwaysInfluencers" collection 
   *   and insert the corresponding people into the "people" collection
   * - It will simultaneously get the id of each person and insert the corresponding JOIN documents in the "JOIN_pathways_people" collection
  */

const seedPeopleFromPathwaysInfluencers = async () => {
  const dbs = await connectToMongoDb()

  const pulseCoreDb = dbs.db('pulse-core')
  const pulseDevDb = dbs.db('pulse-dev')

  // Find all influencers that needs to be udpated
  const pathwaysInfluencers = await pulseDevDb.collection('RAW_pathwaysInfluencers')
    .find({
      $and: [
        { type: 'Pathways' },
        {
          $or: [
            { npiNumber: { $nin: ['N/A', null] } },
            { personId: { $ne: null } }
          ]
        }
      ]
    })
    .toArray()

  
  console.log('Remove All JOIN_pathways_people documents...')
  await pulseCoreDb.collection('JOIN_pathways_people').deleteMany()

  console.log('Remove All EXISTING_pathways_people documents...')
  await pulseCoreDb.collection('EXISTING_pathways_people').deleteMany()

  console.log('Remove All Pathways People documents from People collection...')
  await pulseCoreDb.collection('people').deleteMany({
    isPathwaysPeople: true
  })

  const indications = await pulseCoreDb.collection('indications')
    .find()
    .toArray()

  const keyedIndicationsByName = _.keyBy(indications, 'name')

  const ops = pathwaysInfluencers.map(async datum => {
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

    // See if person with personId already exists (anyone with a personId will most likely already be in the DB)
    const personWithId = await pulseCoreDb.collection('people').findOne({ _id: ObjectId(personId) })
    const personWithNpi = await pulseCoreDb.collection('people').findOne({ nationalProviderIdentifier: Number(npiNumber) })
    const personWithName = await pulseCoreDb.collection('people').findOne({
      firstName,
      middleName,
      lastName
    })

    // if person in pathwaysInfluencers does not already exist
    if (personWithId === null && personWithNpi === null) {
      // Insert the person only if it doesn't have a corresponding name
      if (personWithName === null) {
        const { insertedId } = await pulseCoreDb.collection('people')
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
  
        console.log(`Inserted Person of ${ firstName } ${ middleName } ${ lastName } into people collection`)
        
        const pathwaysOrg = await pulseCoreDb.collection('organizations')
          .findOne({ type: 'Pathways', slug })
  
        const indicationIds = []
  
        indication.forEach(indicationName => {
          const indicationIdObj = keyedIndicationsByName[indicationName]
          if (indicationIdObj) indicationIds.push(indicationIdObj._id)
        })
    
        const joinPathwaysPeopleDoc = {
          _id: ObjectId(),
          personId: insertedId,
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
  
        await pulseCoreDb.collection('JOIN_pathways_people')
          .insertOne(joinPathwaysPeopleDoc)
      } else {
        console.log(`Inserting person: ${ firstName} ${ middleName } ${ lastName } into EXISTING_pathways_people`)

        // Generates list of people with conflicting names
        await pulseCoreDb.collection('EXISTING_pathways_people')
          .insertOne(datum)
      }
    }
  })

  await Promise.all(ops)
  
  dbs.close()
}

seedPeopleFromPathwaysInfluencers()

