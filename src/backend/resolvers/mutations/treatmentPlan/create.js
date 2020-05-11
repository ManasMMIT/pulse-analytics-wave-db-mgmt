const { ObjectId } = require('mongodb')

const createSourceTreatmentPlan = async (
  parent,
  {
    input: {
      indication,
      regimen,
      line,
      population,
      book,
      coverage,
    }
  },
  { pulseCoreDb },
  info,
) => {
  const findSetObj = {
    indication: ObjectId(indication),
    regimen: ObjectId(regimen),
    line: ObjectId(line),
    population: ObjectId(population),
    book: ObjectId(book),
    coverage: ObjectId(coverage),
  }

  const { value } = await pulseCoreDb
    .collection('treatmentPlans')
    .findOneAndUpdate(
      findSetObj,
      {
        $set: findSetObj
      },
      { upsert: true }
    )

  return value
}
module.exports = createSourceTreatmentPlan
