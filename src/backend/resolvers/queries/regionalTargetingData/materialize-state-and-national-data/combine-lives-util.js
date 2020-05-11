const d3 = require('d3-collection')
const _ = require('lodash')

const RESTRICTIVE_SCORE_THRESHOLD = 11

const generateAccessBuckets = ({
  payersWithAccessAdded,
  totalLives,
}) => {
  let accessBuckets = d3.nest()
    .key(d => d.access)
    .rollup(payersForAccessBucket => {
      const livesRaw = payersForAccessBucket.reduce((acc, payerObj) => acc + payerObj.livesRaw, 0)
      const livesPercent = livesRaw / totalLives

      const orderedPayers = _.orderBy(payersForAccessBucket, ['livesPercent'], ['desc'])
      let [{ access, score, color }] = payersForAccessBucket
      score = Number(score)

      return {
        access,
        score,
        color,
        livesRaw,
        livesPercent,
        payers: orderedPayers,
      }
    })
    .object(payersWithAccessAdded)

  accessBuckets = Object.values(accessBuckets)
  accessBuckets = _.orderBy(accessBuckets, ['score'], ['desc'])

  return accessBuckets
}

module.exports = {
  RESTRICTIVE_SCORE_THRESHOLD,
  generateAccessBuckets
}
