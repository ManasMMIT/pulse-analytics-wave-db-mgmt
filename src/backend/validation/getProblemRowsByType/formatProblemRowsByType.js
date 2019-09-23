const stringSimilarity = require('string-similarity')

const ROWS_TO_SKIP = 4

const formatProblemRowsByType = (validFieldsByType, data) => (
  data.reduce((acc, row, index) => {
    const { indication, slug, regimen } = row

    const sheetRow = index + ROWS_TO_SKIP

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
        sheetRow,
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
      } = stringSimilarity.findBestMatch(slug, validSlugs)

      acc.slug.push({
        sheetRow,
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
      } = stringSimilarity.findBestMatch(regimen, validRegimens)

      acc.regimen.push({
        sheetRow,
        value: regimen,
        suggestion: target,
      })
    }

    return acc
  }, { regimen: [], indication: [], slug: [] })
)

module.exports = formatProblemRowsByType
