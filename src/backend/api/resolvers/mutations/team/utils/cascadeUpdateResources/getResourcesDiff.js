const _ = require('lodash')
const { keyOutTreatmentPlans } = require('./utils')

const unwindTreatmentPlans = treatmentPlans => {
  const result = treatmentPlans.reduce((acc, indObj) => {
    acc.push({ _id: indObj._id, regimens: null })

    const flattenedIndObj = indObj.regimens.map(reg => ({
      _id: indObj._id, regimens: reg
    }))

    return [...acc, ...flattenedIndObj]
  }, [])

  return result
}

const regroupTreatmentPlans = treatmentPlans => {
  const tpsGroupedById = _.groupBy(treatmentPlans, '_id')

  const result = _.map(tpsGroupedById, (arrOfReg, indId) => {
    const regimens = arrOfReg.reduce((acc, { regimens }) => {
      if (!regimens) return acc // avoid the null values
      acc.push(regimens)
      return acc
    }, [])

    return { _id: indId, regimens }
  })

  return result
}

const getResourcesDiff = ({
  nextResources,
  prevResources,
}) => {
  let accountsToRemove = {}
  let accountsToAdd = {}
  let treatmentPlansToRemove = []
  let treatmentPlansToAdd = {}

  const {
    accounts: nextAccounts,
    treatmentPlans: nextTreatmentPlans,
  } = nextResources

  if (prevResources) {
    const {
      accounts: prevAccounts = [],
      treatmentPlans: prevTreatmentPlans = [],
    } = prevResources

    const commonAccounts = _.intersectionWith(nextAccounts, prevAccounts, _.isEqual)

    accountsToAdd = _.keyBy(
      _.xorWith(nextAccounts, commonAccounts, _.isEqual),
      '_id',
    )

    accountsToRemove = _.keyBy(
      _.xorWith(prevAccounts, commonAccounts, _.isEqual),
      '_id',
    )

    const unwoundPrevTps = unwindTreatmentPlans(prevTreatmentPlans)
    const unwoundNextTps = unwindTreatmentPlans(nextTreatmentPlans)

    const commonTps = _.intersectionWith(unwoundPrevTps, unwoundNextTps, _.isEqual)

    const indRegCombosToAdd = _.xorWith(unwoundNextTps, commonTps, _.isEqual)

    const indRegCombosToRemove = _.xorWith(unwoundPrevTps, commonTps, _.isEqual)

    treatmentPlansToAdd = keyOutTreatmentPlans(
      regroupTreatmentPlans(indRegCombosToAdd)
    )

    treatmentPlansToRemove = indRegCombosToRemove
  } else {
    accountsToAdd = _.keyBy(nextAccounts, '_id')

    treatmentPlansToAdd = keyOutTreatmentPlans(nextTreatmentPlans)
  }

  return {
    accountsToRemove,
    accountsToAdd,
    treatmentPlansToRemove,
    treatmentPlansToAdd,
  }
}

module.exports = getResourcesDiff
