module.exports = async ({
  pulseCore,
  payerHistoricalQualityAccess,
  payerHistoricalAdditionalCriteria,
  payerHistoricalPolicyLinks,
}) => {
  await pulseCore.collection('books-2').deleteMany()

  const combinedHistoricalData = [
    ...payerHistoricalQualityAccess,
    ...payerHistoricalAdditionalCriteria,
    ...payerHistoricalPolicyLinks,
  ]

  const booksObj = combinedHistoricalData.reduce((acc, { book, bookOfBusiness }) => {
    const bookName = book || bookOfBusiness
    if (bookName && !acc[bookName]) {
      acc[bookName] = bookName
    }

    return acc
  }, {})

  const booksDocs = Object.keys(booksObj).map(name => ({ name }))

  await pulseCore.collection('books-2').insertMany(booksDocs)

  console.log('`books` collection seeded')
  
}
