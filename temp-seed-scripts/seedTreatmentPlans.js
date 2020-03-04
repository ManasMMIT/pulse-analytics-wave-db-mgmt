const _ = require('lodash')

module.exports = async ({
  pulseCore,
  payerHistoricalQualityAccess,
  payerHistoricalAdditionalCriteria,
}) => {
  await pulseCore.collection('treatmentPlans-2').deleteMany()

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

  const lines = await pulseCore.collection('lines-2').find({}).toArray()

  const linesIdMap = lines.reduce((acc, { name, _id }) => {
    acc[name] = _id

    return acc
  }, {})

  const populations = await pulseCore.collection('populations-2').find({}).toArray()

  const populationsIdMap = populations.reduce((acc, { name, _id }) => {
    acc[name] = _id

    return acc
  }, {})

  const books = await pulseCore.collection('books-2').find({}).toArray()

  const booksIdMap = books.reduce((acc, { name, _id }) => {
    acc[name] = _id

    return acc
  }, {})

  const coverages = await pulseCore.collection('coverages-2').find({}).toArray()

  const coveragesIdMap = coverages.reduce((acc, { name, _id }) => {
    acc[name] = _id

    return acc
  }, {})

  // reference hashes for all historical data, inserting tp combos
  const allTheThings = [
    ...payerHistoricalQualityAccess,
    ...payerHistoricalAdditionalCriteria,
  ]

  const onlyTreatmentPlanDocs = allTheThings.filter(thing => {
    const isValid = (
      indicationsIdMap[thing.indication]
      && regimensIdMap[thing.regimen]
      && thing.line
      && thing.population
      && thing.book
      && thing.coverage
    )

    return isValid
  })

  const uniqTpsDocs = _.uniqBy(
    onlyTreatmentPlanDocs,
    thing => [thing.indication, thing.regimen, thing.line, thing.population, thing.book, thing.coverage].join('|')
  )

  const ops = uniqTpsDocs
    .map(async ({ indication, regimen, population, line, book, coverage }) => (
      pulseCore
        .collection('treatmentPlans-2')
        .insertOne({
          indication: indicationsIdMap[indication] || indication,
          regimen: regimensIdMap[regimen] || regimen,
          population: populationsIdMap[population] || population,
          line: linesIdMap[line] || line,
          book: booksIdMap[book] || book,
          coverage: coveragesIdMap[coverage] || coverage,
        })
    ))

  await Promise.all(ops)

  console.log('`treatmentPlan combos seeded`');
};
