const connectToMongoDb = require('./connect-to-mongodb')
const { getScriptTerminator } = require('./utils')
const _ = require('lodash')

const prependZeroToMonth = month => month < 10 ? `0${month}` : month

const bucketizeHistoricalQOAData = async () => {
  const mongoConnection = await connectToMongoDb()
  const terminateScript = getScriptTerminator(mongoConnection)
  const pulseDevDb = await mongoConnection.db('pulse-dev')

  let accesses = await pulseDevDb.collection('payerHistoricalQualityAccessHt')
    .find()
    .toArray()

  console.log(`Existing Document Size: ${ accesses.length }`)

  console.log('Grouping Data by unique combinations')

  const groupedAccesses = _.groupBy(
    accesses,
    ({ slug, organization, indication, population, line, regimen, coverage, book, project }) => {
      return `${ slug }|${ organization }|${ indication }|${ population }|${ line }|${ regimen }|${ coverage }|${ book }|${ project }`
    }
  )

  console.log('Bucketizing Accesses')

  const bucketizedAccesses = Object.keys(groupedAccesses)
    .map(key => {
      const groupIdentifier = key.split('|')
      const [slug, organization, indication, population, line, regimen, coverage, book, project] = groupIdentifier
      const accessByMonth = []

      groupedAccesses[key].forEach(({ month, year, access }) => {
        const isoDate = new Date(`${year}-${ prependZeroToMonth(month) }-01T12:00:00Z`)
        const obj = {
          isoDate,
          access
        }
        
        accessByMonth.push(obj)
      })

      return {
        slug,
        organization,
        indication,
        regimen,
        population,
        line,
        coverage,
        book,
        accessByMonth,
        project
      }
    })
  
  console.log(`Bucketed Document Size: ${ bucketizedAccesses.length }`)

  console.log('Removing existing documents in collection')

  // Remove all documents in payerBucketedHistoricalAccess
  await pulseDevDb.collection('payerBucketedHistoricalAccess').deleteMany({})

  console.log('Inserting grouped documents into collection')

  await pulseDevDb.collection('payerBucketedHistoricalAccess')
    .insertMany(bucketizedAccesses)
    .catch(terminateScript)

  console.log('Insertion Complete')
  await terminateScript()
}

bucketizeHistoricalQOAData()