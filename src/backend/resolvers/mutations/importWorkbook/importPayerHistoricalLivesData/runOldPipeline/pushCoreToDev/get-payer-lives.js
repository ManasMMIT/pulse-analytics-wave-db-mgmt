const _ = require('lodash')

const getStateLivesTotals = (stateLives) => {
  const livesByState = _.groupBy(stateLives, 'state')

  const result = _.map(livesByState, (payers, state) => {
    const livesTypesAccumulator = {
      medicaidMedical: 0,
      medicaidPharmacy: 0,
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
      federalOtherMedical: 0,
      federalOtherPharmacy: 0,
    }

    const livesTypesKeys = Object.keys(livesTypesAccumulator)

    const livesTypesTotals = payers.reduce((memo, payerObj) => {
      // skip rows that have a parentSlug or dataType
      if (payerObj.parentSlug || payerObj.dataType) return memo

      livesTypesKeys.forEach((livesType) => {
        memo[livesType] += Number(payerObj[livesType]) || 0
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

const getNationalLivesTotals = (data) => {
  const livesType = {
    medicaidMedical: 0,
    medicaidPharmacy: 0,
    commercialMedical: 0,
    medicareMedical: 0,
    commercialPharmacy: 0,
    medicarePharmacy: 0,
    managedMedicaidPharmacy: 0,
    managedMedicaidMedical: 0,
    ffsMedicaidMedical: 0,
    ffsMedicaidPharmacy: 0,
    totalPharmacy: 0,
    totalMedical: 0,
    macMedical: 0,
    federalOtherMedical: 0,
    federalOtherPharmacy: 0,
  }

  const reduceCallback = (memo, item) => {
    // disregard rows that have a dataType, and also rows that have a parentSlug
    // to avoid redundant counting of both parent and children payer lives
    if (item.dataType || item.parentSlug) return memo

    Object.keys(livesType).forEach((objKey) => {
      memo[objKey] += Number(item[objKey]) || 0
    })

    return memo
  }

  const nationalLivesTotals = data.reduce(reduceCallback, livesType)

  return nationalLivesTotals
}

module.exports = {
  getStateLivesTotals,
  getNationalLivesTotals,
}
