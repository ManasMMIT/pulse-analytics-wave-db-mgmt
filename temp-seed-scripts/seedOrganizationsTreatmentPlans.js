require("dotenv").load();
const mongoDB = require("mongodb");
const _ = require('lodash')

const MongoClient = mongoDB.MongoClient;

const LOADER_URI = process.env.LOADER_URI;

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
    ...payerHistoricalPolicyLinks,
  ]

  const onlyTreatmentPlanDocsWithOrgs = allTheThings.filter(thing => (
    thing.slug
    && thing.indication
    && thing.regimen
    && thing.line
    && thing.population
    && thing.book
    && thing.coverage
  ))

  const uniqOrgTpsDocs = _.uniqBy(
    onlyTreatmentPlanDocsWithOrgs,
    thing => thing.slug + thing.indication + thing.regimen + thing.line + thing.population + thing.book + thing.coverage
  )

  const indications = await pulseCore.collection('indications').find({}).toArray()

  const indicationsIdMap = indications.reduce((acc, { name, _id }) => {
    acc[name] = _id

    return acc
  }, {})

  const regimens = await pulseCore.collection('regimens').find({}).toArray()

  const regimensIdMap = regimens.reduce((acc, { name, _id }) => {
    acc[name] = _id

    return acc
  }, {})

  const lines = await pulseCore.collection('lines').find({}).toArray()

  const linesIdMap = lines.reduce((acc, { name, _id }) => {
    acc[name] = _id

    return acc
  }, {})

  const populations = await pulseCore.collection('populations').find({}).toArray()

  const populationsIdMap = populations.reduce((acc, { name, _id }) => {
    acc[name] = _id

    return acc
  }, {})

  const books = await pulseCore.collection('books').find({}).toArray()

  const booksIdMap = books.reduce((acc, { name, _id }) => {
    acc[name] = _id

    return acc
  }, {})

  const coverages = await pulseCore.collection('coverages').find({}).toArray()

  const coveragesIdMap = coverages.reduce((acc, { name, _id }) => {
    acc[name] = _id

    return acc
  }, {})

  const orgs = await pulseCore.collection('organizations').find({}).toArray()

  const orgsIdMap = orgs.reduce((acc, { slug, _id }) => {
    acc[slug] = _id

    return acc
  }, {})

  const ops = uniqOrgTpsDocs
    .map(async ({ slug, indication, regimen, population, line, book, coverage }) => {

      const treatmentPlan = await pulseCore.collection('treatmentPlans')
        .findOne({
          indication: indicationsIdMap[indication],
          regimen: regimensIdMap[regimen],
          population: populationsIdMap[population],
          line: linesIdMap[line],
          book: booksIdMap[book],
          coverage: coveragesIdMap[coverage],
        })

      return {
        treatmentPlanId: treatmentPlan._id,
        organizationId: orgsIdMap[slug],
      }
    })

  const organizationTreatmentPlanDocs = await Promise.all(ops)

  await pulseCore.collection('organizations.treatmentPlans')
    .insertMany(organizationTreatmentPlanDocs)

  await pulseCore.collection('organizations.treatmentPlans')
    .deleteMany({ organizationId: null })

  console.log('DONEZO');

  dbs.close();
};

beginMongoWork();
