const _ = require('lodash')
const { RESTRICTIVE_SCORE_THRESHOLD, generateAccessBuckets } = require('./combine-lives-util')

const combineNationalLives = ({
  payerHistoricalDrgNationalLives,
  payerHistoricalMmitNationalLives,
  payerDrgNationalLivesTotals,
  payerMmitNationalLivesTotals,
  livesType,
  combinedPayerDataBySlug,
}) => {
  // key both DRG & MMIT national lives by slug
  const LIVES_DATA_drgPayersBySlug = _.keyBy(payerHistoricalDrgNationalLives, 'slug')
  const LIVES_DATA_mmitPayersBySlug = _.keyBy(payerHistoricalMmitNationalLives, 'slug')
  
  const DRG_nationalData = bucketizeLivesData({
    livesData: LIVES_DATA_drgPayersBySlug,
    combinedPayerDataBySlug,
    livesType,
    livesTotals: payerDrgNationalLivesTotals[0],
  })

  const MMIT_nationalData = bucketizeLivesData({
    livesData: LIVES_DATA_mmitPayersBySlug,
    combinedPayerDataBySlug,
    livesType,
    livesTotals: payerMmitNationalLivesTotals[0],
  })

  return { DRG_nationalData, MMIT_nationalData }

  function bucketizeLivesData({
    livesData,
    combinedPayerDataBySlug,
    livesType, 
    livesTotals,
  }) {
    // use the total national lives for this particular livesType
    const totalNationalLives = livesTotals[livesType]
    let totalAuditedLives = 0
    let restrictiveLivesPercent = 0

    const payersWithAccessAdded = _.reduce(livesData, (acc, payerObj) => {
      const lives = Number(payerObj[livesType])
      if (!lives) return acc
      
      const { slug } = payerObj
      const qoaDataForSlug = combinedPayerDataBySlug[slug]
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
}

module.exports = combineNationalLives