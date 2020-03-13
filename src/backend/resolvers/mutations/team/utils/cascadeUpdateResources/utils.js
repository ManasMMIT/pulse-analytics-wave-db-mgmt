const _ = require('lodash')
const ObjectId = require('mongodb').ObjectId

const keyOutTreatmentPlans = treatmentPlans => (
  _.mapValues(
    _.keyBy(treatmentPlans, '_id'),
    ({ regimens }) => _.keyBy(regimens, '_id')
  )
)

const arrayifyTreatmentPlans = keyedOutTreatmentPlans => {
  const result = _.map(keyedOutTreatmentPlans, (regHash, indId) => {
    const regimens = Object.values(regHash)

    return {
      _id: ObjectId(indId),
      regimens,
    }
  })

  return result
}

module.exports = {
  keyOutTreatmentPlans,
  arrayifyTreatmentPlans,
}
