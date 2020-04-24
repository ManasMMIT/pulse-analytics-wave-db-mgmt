const _ = require('lodash')
const { RESTRICTIVE_SCORE_THRESHOLD, generateAccessBuckets } = require('./combine-lives-util')

const combineNationalLives = ({
  nationalLives,
  nationalLivesTotals,
  livesType,
  combinedPayerDataBySlug,
}) => {
  // use the total national lives for this particular livesType
  const totalNationalLives = nationalLivesTotals[livesType]
  let totalAuditedLives = 0
  let restrictiveLivesPercent = 0

  const originalLength = nationalLives.length

  // temporarily unique specifically like this just to mirror what's currently done in wave-db-mgmt
  const nationalLivesUniqueBySlug = Object.values(_.keyBy(nationalLives, 'slug'))
  const newLength = nationalLivesUniqueBySlug.length

  if (newLength !== originalLength) console.error('National lives collection has dupe slug entries!')

  const payersWithAccessAdded = nationalLivesUniqueBySlug.reduce((acc, payerObj) => {
    const lives = Number(payerObj[livesType])
    if (!lives) return acc

    const { slug } = payerObj
    const qoaDataForSlug = combinedPayerDataBySlug[slug]
    // skip payers who either aren't profiled in the qoa data OR user doesn't have access to the account
    if (!qoaDataForSlug) return acc

    let livesPercent = 0
    if (totalNationalLives) { // to prevent division by 0
      livesPercent = lives / totalNationalLives
    }

    if (Number(qoaDataForSlug.score) >= RESTRICTIVE_SCORE_THRESHOLD) {
      restrictiveLivesPercent += livesPercent
    }

    totalAuditedLives += lives

    acc.push({ ...qoaDataForSlug, livesPercent, livesRaw: lives })

    return acc
  }, [])

  const accessBuckets = generateAccessBuckets({ payersWithAccessAdded, totalLives: totalNationalLives })

  let totalNationalAuditedLivesPercent = 0
  if (totalNationalLives) { // to prevent division by 0
    totalNationalAuditedLivesPercent = totalAuditedLives / totalNationalLives
  }

  return {
    auditedLives: totalAuditedLives,
    totalLives: totalNationalLives,
    auditedLivesPercent: totalNationalAuditedLivesPercent,
    restrictiveLivesPercent,
    accessBuckets,
  }
}

module.exports = combineNationalLives
