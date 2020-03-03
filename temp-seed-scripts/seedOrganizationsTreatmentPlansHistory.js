require("dotenv").load();
const mongoDB = require("mongodb");
const _ = require('lodash')

const MongoClient = mongoDB.MongoClient;

const LOADER_URI = process.env.LOADER_URI;

const ENRICH_TP_FIELDS_PIPELINE = [
  {
    '$lookup': {
      'from': 'indications',
      'localField': 'indication',
      'foreignField': '_id',
      'as': 'indication'
    }
  }, {
    '$lookup': {
      'from': 'regimens',
      'localField': 'regimen',
      'foreignField': '_id',
      'as': 'regimen'
    }
  }, {
    '$lookup': {
      'from': 'lines',
      'localField': 'line',
      'foreignField': '_id',
      'as': 'line'
    }
  }, {
    '$lookup': {
      'from': 'populations',
      'localField': 'population',
      'foreignField': '_id',
      'as': 'population'
    }
  }, {
    '$lookup': {
      'from': 'books',
      'localField': 'book',
      'foreignField': '_id',
      'as': 'book'
    }
  }, {
    '$lookup': {
      'from': 'coverages',
      'localField': 'coverage',
      'foreignField': '_id',
      'as': 'coverage'
    }
  }, {
    '$project': {
      'indication': {
        '$arrayElemAt': [
          '$indication', 0
        ]
      },
      'regimen': {
        '$arrayElemAt': [
          '$regimen', 0
        ]
      },
      'population': {
        '$arrayElemAt': [
          '$population', 0
        ]
      },
      'line': {
        '$arrayElemAt': [
          '$line', 0
        ]
      },
      'book': {
        '$arrayElemAt': [
          '$book', 0
        ]
      },
      'coverage': {
        '$arrayElemAt': [
          '$coverage', 0
        ]
      }
    }
  }, {
    '$project': {
      'indication': '$indication.name',
      'regimen': '$regimen.name',
      'population': '$population.name',
      'line': '$line.name',
      'book': '$book.name',
      'coverage': '$coverage.name'
    }
  }
]

const beginMongoWork = async () => {
  console.log("----------Mongo Connect-----------");

  const dbs = await MongoClient.connect(LOADER_URI, { useNewUrlParser: true }).catch(err => {
    console.error(err);
    process.exit();
  });

  console.log("Connected to MongoDB successfully...");

  const pulseCore = dbs.db('pulse-core');
  const pulseDev = dbs.db('pulse-dev');
  const pulseProd = dbs.db('pulse-prod');

  // Get all historical collections and combine them
  const payerHistoricalQualityAccess = await pulseCore
    .collection('payerHistoricalQualityAccess')
    .find({})
    .toArray()

  const payerHistoricalAdditionalCriteria = await pulseCore
    .collection('payerHistoricalAdditionalCriteria')
    .find({})
    .toArray()

  const payerHistoricalPolicyLinks = await pulseCore
    .collection('payerHistoricalPolicyLinks')
    .find({})
    .toArray()

  const allTheThings = [
    ...payerHistoricalQualityAccess,
    ...payerHistoricalAdditionalCriteria,
    // ...payerHistoricalPolicyLinks,
  ]

  // only deal with docs that have all required fields for this historic collection
  const onlyTreatmentPlanDocsWithOrgsMonthYear = allTheThings.filter(thing => (
    thing.slug
    && thing.indication
    && thing.regimen
    && thing.line
    && thing.population
    && thing.book
    && thing.coverage
    && thing.month
    && thing.year
  ))

  // create hashes of all collections
  const groupedOrgTpsMonthYearDocs = _.groupBy(
    onlyTreatmentPlanDocsWithOrgsMonthYear,
    thing => thing.slug + thing.indication + thing.regimen + thing.line + thing.population + thing.book + thing.coverage + thing.month + thing.year
  )

  const policyLinksGroupedbyTpParts = _.groupBy(
    payerHistoricalPolicyLinks,
    thing => thing.slug + thing.regimen + thing.book + thing.coverage + thing.month + thing.year
  )

  const organizations = await pulseCore.collection('organizations')
    .find({}).toArray()

  const orgsBySlug = _.groupBy(organizations, 'slug')

  const accessScores = await pulseCore.collection('qualityOfAccessScore')
    .find({}).toArray()

  const accessScoresGroupedByAccess = _.groupBy(accessScores, 'access')

  const enrichedTreatmentPlan = await pulseCore.collection('treatmentPlans')
    .aggregate(ENRICH_TP_FIELDS_PIPELINE)
    .toArray()

  const hashedTps = _.groupBy(
    enrichedTreatmentPlan,
    thing => thing.indication + thing.regimen + thing.line + thing.population + thing.book + thing.coverage,
  )

  console.log(Object.keys(groupedOrgTpsMonthYearDocs).length)

  const docs = []
  for (let uniqOrgTpTimeString in groupedOrgTpsMonthYearDocs) {
    const comboDocs = groupedOrgTpsMonthYearDocs[uniqOrgTpTimeString]

    const flatDoc = Object.assign({}, ...comboDocs)

    const policyLinkHash = flatDoc.slug + flatDoc.regimen + flatDoc.book + flatDoc.coverage + flatDoc.month + flatDoc.year
    const policyLinkData = policyLinksGroupedbyTpParts[policyLinkHash] || []

    const links = policyLinkData[0]
      ? {
        policyLink: policyLinkData[0].link,
        dateTracked: policyLinkData[0].dateTracked,
        paLink: policyLinkData[0].paLink,
        project: policyLinkData[0].project,
        siteLink: policyLinkData[0].siteLink,
      }
      : null

    const hashForTps = flatDoc.indication + flatDoc.regimen + flatDoc.line + flatDoc.population + flatDoc.book + flatDoc.coverage

    const treatmentPlan = hashedTps[hashForTps] || []

    const treatmentPlanId = treatmentPlan[0]
      ? treatmentPlan[0]._id
      : null

    const organization = orgsBySlug[flatDoc.slug] || []

    const organizationId = organization[0]
      ? organization[0]._id
      : null

    const accessScore = accessScoresGroupedByAccess[flatDoc.access] || []

    const timestamp = new Date(`${flatDoc.month}/1/${flatDoc.year}`)

    const doc = {
      organizationId,
      treatmentPlanId,
      accessData: accessScore[0],
      tierData: {
        tier: flatDoc.tier,
        tierRating: flatDoc.tierRating,
        tierTotal: flatDoc.tierTotal,
      },
      timestamp,
      project: flatDoc.project,
      policyLinkData: links,
      additionalCriteriaData: {
        criteria: flatDoc.criteria,
        criteriaNotes: flatDoc.criteriaNotes,
        restrictionLevel: flatDoc.restrictionLevel,
        subPopulation: flatDoc.subPopulation,
        lineOfTherapy: flatDoc.lineOfTherapy,
      }
    }

    delete doc._id

    docs.push(doc)
  }

  await pulseCore.collection('organizations.treatmentPlans.history')
    .insertMany(docs)

  //   const uniqOrgTpsDocs = _.uniqBy(
  //     onlyTreatmentPlanDocsWithOrgs,
  //     thing => thing.slug + thing.indication + thing.regimen + thing.line + thing.population + thing.book + thing.coverage
  //   )

  //   const indications = await pulseCore.collection('indications').find({}).toArray()

  //   const indicationsIdMap = indications.reduce((acc, { name, _id }) => {
  //     acc[name] = _id

  //     return acc
  //   }, {})

  //   const regimens = await pulseCore.collection('regimens').find({}).toArray()

  //   const regimensIdMap = regimens.reduce((acc, { name, _id }) => {
  //     acc[name] = _id

  //     return acc
  //   }, {})

  //   const lines = await pulseCore.collection('lines').find({}).toArray()

  //   const linesIdMap = lines.reduce((acc, { name, _id }) => {
  //     acc[name] = _id

  //     return acc
  //   }, {})

  //   const populations = await pulseCore.collection('populations').find({}).toArray()

  //   const populationsIdMap = populations.reduce((acc, { name, _id }) => {
  //     acc[name] = _id

  //     return acc
  //   }, {})

  //   const books = await pulseCore.collection('books').find({}).toArray()

  //   const booksIdMap = books.reduce((acc, { name, _id }) => {
  //     acc[name] = _id

  //     return acc
  //   }, {})

  //   const coverages = await pulseCore.collection('coverages').find({}).toArray()

  //   const coveragesIdMap = coverages.reduce((acc, { name, _id }) => {
  //     acc[name] = _id

  //     return acc
  //   }, {})

  //   const orgs = await pulseCore.collection('organizations').find({}).toArray()

  //   const orgsIdMap = orgs.reduce((acc, { slug, _id }) => {
  //     acc[slug] = _id

  //     return acc
  //   }, {})

  //   const ops = uniqOrgTpsDocs
  //     .map(async ({ slug, indication, regimen, population, line, book, coverage }) => {

  //       const treatmentPlan = await pulseCore.collection('treatmentPlans')
  //         .findOne({
  //           indication: indicationsIdMap[indication],
  //           regimen: regimensIdMap[regimen],
  //           population: populationsIdMap[population],
  //           line: linesIdMap[line],
  //           book: booksIdMap[book],
  //           coverage: coveragesIdMap[coverage],
  //         })

  //       return {
  //         treatmentPlanId: treatmentPlan._id,
  //         organizationId: orgsIdMap[slug],
  //       }
  //     })

  //   const organizationTreatmentPlanDocs = await Promise.all(ops)
  // debugger

  //   await pulseCore.collection('organizations.treatmentPlans')
  //     .insertMany(organizationTreatmentPlanDocs)

  // await pulseCore.collection('organizations.treatmentPlans')
  //   .deleteMany({ organizationId: null })


  console.log('DONEZO');

  dbs.close();
};

beginMongoWork();
