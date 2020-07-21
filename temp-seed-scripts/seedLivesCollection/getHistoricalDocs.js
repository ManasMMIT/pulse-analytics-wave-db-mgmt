const format = require('date-fns/format')
const { zonedTimeToUtc } = require('date-fns-tz')

const DEFAULT_TIMEZONE = require('../../src/backend/utils/defaultTimeZone')
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

  const isoShortString = format(new Date(doc.year, doc.month - 1, 1), 'yyyy-MM-dd')
  // create JS Date Object (which only stores dates in absolute UTC time) as the UTC equivalent of isoShortString in New York time
  const timestamp = zonedTimeToUtc(isoShortString, DEFAULT_TIMEZONE)

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
    const lives = (
        [null, '', undefined].includes(parsedLivesValue)
        || isNaN(parsedLivesValue)
      )
      ? null
      : parsedLivesValue

    const comboDoc = {
      organizationId,
      timestamp,
      bookId: mappedData.bookId,
      coverageId: mappedData.coverageId,
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
