const collections = async (parent, { type }, { pulseRawDb, pulseCoreDb, pulseProdDb }) => {
  let collections

  switch (type) {
    case 'raw':
      collections = await pulseRawDb.listCollections().toArray()
      break
    case 'dev':
      collections = await pulseCoreDb.listCollections().toArray()
      break
    case 'prod':
      collections = await pulseProdDb.listCollections().toArray()
      break
    default:
      collections = await pulseRawDb.listCollections().toArray()
      break
  }

  return collections.map(({ name }) => name)
}

module.exports = collections
