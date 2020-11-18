const _ = require('lodash')

const qualityOfAccessScores = async (parent, args, { pulseCoreDb }, info) => {
  const qualityOfAccessScores = await pulseCoreDb
    .collection('qualityOfAccessScore')
    .find()
    .toArray()

  const sortedQualityOfAccessScores = _.orderBy(
    qualityOfAccessScores,
    [({ sortOrder }) => parseInt(sortOrder), ({ score }) => parseInt(score)],
    ['desc', 'desc']
  )

  return sortedQualityOfAccessScores
}

module.exports = qualityOfAccessScores
