const format = require('date-fns/format')

const KEY_BOOK_COVERAGE_MAP = require('./key-book-coverage-map')

module.exports = ({
  historicalDocs,
  organizationsHash,
  source,
}) => historicalDocs.reduce((acc, doc) => {
  // Get shared fields for all comboDocs
  const organization = organizationsHash[doc.slug]
  if (!organization || !doc.month || !doc.year) return acc

  const organizationId = organization._id

  const correctIsoFormat = format(new Date(doc.year, doc.month, 1), 'yyyy-MM-dd')
  const timestamp = new Date(correctIsoFormat)

  const [
    territoryType,
    territoryName,
  ] = [
    doc.state ? 'U.S. State' : 'National',
    doc.state || 'United States',
  ]

  const parentOrganization = organizationsHash[doc.parentSlug]

  const parentIdObj = parentOrganization
    ? { parentOrganizationId: parentOrganization._id}
    : {}

  const uniqBookCoverageDocs = Object.keys(doc).reduce((acc, key) => {
    const mappedData = KEY_BOOK_COVERAGE_MAP[key]
    if (!mappedData) return acc

    const parsedLivesValue = parseInt(doc[key])

    // ! let 0 through
    const lives = [null, '', undefined].includes(parsedLivesValue)
      ? null
      : parsedLivesValue

    const comboDoc = {
      organizationId,
      timestamp,
      book: mappedData.book,
      coverage: mappedData.coverage,
      lives,
      source,
      territoryType,
      territoryName,
      ...parentIdObj,
    }

    return [
      ...acc,
      comboDoc,
    ]
  }, [])

  return [
    ...acc,
    ...uniqBookCoverageDocs,
  ]
}, [])
