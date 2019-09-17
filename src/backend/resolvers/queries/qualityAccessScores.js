const _ = require('lodash')

const qualityAccessScores = async (parent, args, { pulseCoreDb }, info) => {
  const qualityAccessScores = await pulseCoreDb.collection('qualityAccessScores').find().toArray()

  const sortedQualityAccessScores = _.orderBy(
    qualityAccessScores,
    [
      ({ score }) => parseInt(score),
      ({ sortOrder }) => parseInt(sortOrder)
    ],
    ['desc', 'asc']
  )

  return sortedQualityAccessScores
}

module.exports = qualityAccessScores
