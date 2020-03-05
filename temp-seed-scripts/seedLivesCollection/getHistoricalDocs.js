const KEY_BOOK_COVERAGE_MAP = require('./key-book-coverage-map')

module.exports = ({
  historicalDocs,
  organizationsHash,
  source,
}) => historicalDocs.reduce((acc, doc) => {
  // Get shared fields for all comboDocs
  const organization = organizationsHash[doc.slug]
  if (!organization || !doc.month || !doc.year) return acc

  const organizationId = organization[0]._id
  const timestamp = new Date(`${doc.month}/1/${doc.year}`)
  const [
    territoryType,
    territoryName,
  ] = [
      doc.state ? 'U.S. State' : 'National',
      doc.state || 'United States'
    ]

  const uniqBookCoverageDocs = Object.keys(doc).reduce((acc, key) => {
    const mappedData = KEY_BOOK_COVERAGE_MAP[key]
    if (!mappedData) return acc

    const comboDoc = {
      organizationId,
      timestamp,
      book: mappedData.book,
      coverage: mappedData.coverage,
      lives: parseInt(doc[key]),
      source,
      territoryType,
      territoryName,
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
