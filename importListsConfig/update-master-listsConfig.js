const updateMasterListsConfig = async (db, dashboardTool, data) => {
  const collectionName = 'listsConfig'
  const collection = db.collection(collectionName)

  await collection.deleteMany({ dashboardTool })
    .catch(err => {
      console.error('Error deleting subset of master listsConfig', err)
      process.exit()
    })

  await collection.insertMany(data)
    .catch(err => {
      console.error(`Data failed to be imported into master listsConfig`, err)
      process.exit()
    })

  console.log('Master listsConfig successfully updated')
}

module.exports = updateMasterListsConfig
