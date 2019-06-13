const _ = require('lodash')

const getStateLivesTotals = stateLives => {
  const livesByState = _.groupBy(stateLives, 'state')

  const result = _.map(livesByState, (payers, state) => {
    const livesTypesAccumulator = {
      managedMedicaidMedical: 0,
      managedMedicaidPharmacy: 0,
      ffsMedicaidMedical: 0,
      ffsMedicaidPharmacy: 0,
      otherPharmacy: 0,
      totalMedical: 0,
      commercialMedical: 0,
      medicareMedical: 0,
      totalPharmacy: 0,
      commercialPharmacy: 0,
      medicarePharmacy: 0,
      macMedical: 0,
      tricareMedical: 0,
      tricarePharmacy: 0,
      vaMedical: 0,
      vaPharmacy: 0,
    }

    const livesTypesKeys = Object.keys(livesTypesAccumulator)

    const livesTypesTotals = payers.reduce((memo, payerObj) => {
      // skip rows that have a parentSlug or dataType
      if (payerObj.parentSlug || payerObj.dataType) return memo

      livesTypesKeys.forEach(livesType => {
        memo[livesType] += (Number(payerObj[livesType]) || 0)
      })

      return memo
    }, livesTypesAccumulator)

    const [{ stateLong }] = payers

    return {
      state,
      stateLong,
      ...livesTypesTotals,
    }
  })

  return result
}

module.exports = {
  getStateLivesTotals,
}
