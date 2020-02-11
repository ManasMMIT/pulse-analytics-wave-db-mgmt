const convertMongoCollectionFieldsToNumber = db => {
  const collectionNames = [
    'payerHistoricalAdditionalCriteria',
    'payerHistoricalDrgNationalLives',
    'payerHistoricalPolicyLinks',
    'payerHistoricalDrgStateLives'
  ]

  collectionNames.forEach(collectionName => {
    const cursor = db.collection(collectionName).find()

    cursor.forEach(doc => {
      doc.year = Number(doc.year)
      doc.month = Number(doc.month)
      db.collection(collectionName).save(doc)
    })
  })
}
