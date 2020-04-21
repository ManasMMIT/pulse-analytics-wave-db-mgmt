const _ = require('lodash')

module.exports = async ({
  pulseCore,
  payerHistoricalQualityAccess,
}) => {
  await pulseCore.collection('treatmentPlans').deleteMany()

  // setup hashes
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

  // ! quality of access is the source of truth for valid PTPs
  const onlyTreatmentPlanDocs = payerHistoricalQualityAccess.filter(thing => {
    const isValid = (
      indicationsIdMap[thing.indication]
      && regimensIdMap[thing.regimen]
      && linesIdMap[thing.line]
      && populationsIdMap[thing.population]
      && booksIdMap[thing.book]
      && coveragesIdMap[thing.coverage]
    )

    return isValid
  })

  const uniqTpsDocs = _.uniqBy(
    onlyTreatmentPlanDocs,
    thing => [thing.indication, thing.regimen, thing.line, thing.population, thing.book, thing.coverage].join('|')
  )

  const docsToInsert = uniqTpsDocs
    .map(({ indication, regimen, population, line, book, coverage }) => ({
      indication: indicationsIdMap[indication],
      regimen: regimensIdMap[regimen],
      line: linesIdMap[line],
      population: populationsIdMap[population],
      book: booksIdMap[book],
      coverage: coveragesIdMap[coverage],
    }))

  await pulseCore.collection('treatmentPlans')
    .insertMany(docsToInsert)

  console.log('`treatmentPlan combos seeded`');
};
