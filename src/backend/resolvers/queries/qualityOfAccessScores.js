const _ = require('lodash')

const qualityOfAccessScores = async (parent, args, { pulseCoreDb }, info) => {
  const qualityOfAccessScores = await pulseCoreDb.collection('qualityOfAccessScore')
    .find().toArray()

  const sortedQualityOfAccessScores = _.orderBy(
    qualityOfAccessScores,
    [
      ({ score }) => parseInt(score),
      ({ sortOrder }) => parseInt(sortOrder)
    ],
    ['desc', 'asc']
  )

  return sortedQualityOfAccessScores
}

module.exports = qualityOfAccessScores
