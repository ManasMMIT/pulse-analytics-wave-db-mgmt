const pushSheetToCore = async ({
  collectionName,
  month,
  year,
  formattedData,
  pulseCoreDb,
  mongoClient,
}) => {
  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    await pulseCoreDb.collection(collectionName).deleteMany(
      {
        $and: [
          { $or: [{ month: String(month) }, { month }] },
          { $or: [{ year: String(year) }, { year }] },
        ],
      },
      { session }
    )

    await pulseCoreDb
      .collection(collectionName)
      .insertMany(formattedData, { session })
  })

  console.log(
    `Replaced rows for ${month}-${year} in pulse-core.${collectionName}`
  )
}

module.exports = pushSheetToCore
