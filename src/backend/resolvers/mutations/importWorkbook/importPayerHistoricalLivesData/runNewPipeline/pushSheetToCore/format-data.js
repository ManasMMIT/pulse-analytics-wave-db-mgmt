const _ = require('lodash')

module.exports = ({
  data,
  timestamp,
  territoryType,
  source,
  bookCoveragePayerRawData,
}) => {
  const { bookCoverageMap, payerIdBySlug } = getIdMaps(bookCoveragePayerRawData)

  let clonedData = _.cloneDeep(data)

  clonedData = clonedData.reduce((acc, row) => {
    const organizationId = payerIdBySlug[row.slug]

    if (!organizationId) return acc

    const territoryName = row.state || 'United States'

    const parentIdObj =
      row.parentSlug && row.parentSlug in payerIdBySlug
        ? { parentOrganizationId: payerIdBySlug[row.parentSlug] }
        : {}

    _.forEach(bookCoverageMap, (bookCoverageIdsObj, bookCoverageKey) => {
      // if the row doesn't even have a column for given bookCoverageKey, skip
      if (!(bookCoverageKey in row)) return

      const lives = Number(row[bookCoverageKey]) || 0

      acc.push({
        organizationId,
        ...bookCoverageIdsObj,
        timestamp,
        lives,
        source,
        territoryType,
        territoryName,
        ...parentIdObj,
      })
    })

    return acc
  }, [])

  return clonedData
}

const getIdMaps = ({ books, coverages, payers }) => {
  let bookCoverageMap = {}

  for (const book of books) {
    for (const coverage of coverages) {
      const key = _.camelCase(`${book.name} ${coverage.name}`)
      bookCoverageMap[key] = { bookId: book._id, coverageId: coverage._id }
    }
  }

  // ! We don't want the entire bookCoverageMap cross-product, so we filter by hardcoded VALID_BOOK_KEY_COMBOS
  bookCoverageMap = _.pickBy(
    bookCoverageMap,
    (value, key) => key in VALID_BOOK_KEY_COMBOS
  )

  const payerIdBySlug = _.mapValues(_.keyBy(payers, 'slug'), '_id')

  return {
    bookCoverageMap,
    payerIdBySlug,
  }
}

const VALID_BOOK_KEY_COMBOS = {
  commercialMedical: true,
  commercialPharmacy: true,
  medicaidMedical: true,
  medicaidPharmacy: true,
  ffsMedicaidMedical: true,
  ffsMedicaidPharmacy: true,
  macMedical: true,
  managedMedicaidMedical: true,
  managedMedicaidPharmacy: true,
  medicareMedical: true,
  medicarePharmacy: true,
  federalOtherMedical: true,
  federalOtherPharmacy: true,
  healthExchangePharmacy: true,
}
