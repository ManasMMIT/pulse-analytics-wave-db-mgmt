const _ = require('lodash')

const enrich = (data, sideEffectData) => {
  let clonedData = _.cloneDeep(data)

  // 1. Assuming data going straight to dev, tack on createdOn to every doc
  // *** when import changes, going straight to dev may not always be the case
  const createdOn = new Date()
  clonedData = clonedData.map(datum => ({ ...datum, createdOn }))


  // 2. Add side effect data to data
  sideEffectData.forEach(({ mutationTargetIdx, data: dataToAdd }) => {
    clonedData[mutationTargetIdx] = {
      ...clonedData[mutationTargetIdx],
      ...dataToAdd,
    }
  })

  return clonedData
}

module.exports = enrich
