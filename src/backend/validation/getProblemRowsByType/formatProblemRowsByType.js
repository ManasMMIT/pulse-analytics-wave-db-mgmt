const stringSimilarity = require('string-similarity')

const ROWS_TO_SKIP = 4

const formatProblemRowsByType = (validFieldsByType, data) => (
  data.reduce((acc, row, index) => {
    const { indication, slug, regimen } = row

    const trueIndex = index + ROWS_TO_SKIP

    const validIndications = validFieldsByType.indication

    const validSlugs = validFieldsByType.slug

    const validRegimens = validFieldsByType.regimen

    if (
      indication
      && !validIndications.includes(indication)
    ) {
      const {
        bestMatch: { target }
      } = stringSimilarity.findBestMatch(indication, validIndications)

      acc.indication.push({
        index: trueIndex,
        value: indication,
        suggestion: target,
      })
    }

    if (
      slug
      && !validSlugs.includes(slug)
    ) {
      const {
        bestMatch: { target }
      } = stringSimilarity.findBestMatch(slug, validIndications)

      acc.slug.push({
        index: trueIndex,
        value: slug,
        suggestion: target,
      })
    }

    if (
      regimen
      && !validRegimens.includes(regimen)
    ) {
      const {
        bestMatch: { target }
      } = stringSimilarity.findBestMatch(regimen, validIndications)

      acc.regimen.push({
        index: trueIndex,
        value: regimen,
        suggestion: target,
      })
    }

    return acc
  }, { regimen: [], indication: [], slug: [] })
)

module.exports = formatProblemRowsByType
