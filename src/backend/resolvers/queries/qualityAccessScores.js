const _ = require('lodash')

const qualityAccessScores = async (parent, args, { pulseCoreDb }, info) => {
  const qualityAccessScores = await pulseCoreDb.collection('qualityAccessScores').find().toArray()

  const sortedQualityAccessScores = _.sortBy(qualityAccessScores, ({ access }) => parseInt(access))

  return sortedQualityAccessScores
}

module.exports = qualityAccessScores
