const { ObjectId } = require('mongodb')

const isValidConnection = (accOne, accTwo) => {
  const hasVbm = [accOne.type, accTwo.type].includes('Pathways')
    || [accOne.type, accTwo.type].includes('Alternative Payment Model')

  const hasProvider = [accOne.type, accTwo.type].includes('Provider')

  return hasVbm && hasProvider
}

const COLLECTION_NAME = 'newProviders'

const updateProvidersCollection = async ({
  db,
  account,
  oldConnections,
  newConnections,
  session
}) => {
  // Step 0: Remove all old docs from providers sheet
  await db.collection(COLLECTION_NAME)
    .deleteMany(
      {
        _id: {
          $in: oldConnections.map(connection => connection._id)
        }
      },
      { session }
    )

  const providersDocs = newConnections.reduce((acc, connection) => {
    // Step 1: Only allow Pathways/Apm -> Providers connections
    if (!isValidConnection(account, connection.org)) return acc

    // Step 2: correctly format vbm and provider fields for collection
    const Vbm = [account, connection.org]
      .find(({ type }) => ['Alternative Payment Model', 'Pathways'].includes(type))

    const provider = [account, connection.org]
      .find(({ type }) => type === 'Provider')
    
    const providerDoc = {
      _id: ObjectId(connection._id),
      organization: Vbm.organization,
      organizationType: Vbm.type,
      slug: Vbm.slug,
      provider: provider.organization,
      slugProvider: provider.slug,
      state: provider.state,
      oncologists: provider.oncologistsCount,
      sites: provider.sitesCount,
      utilization: connection.utilization,
      // ! alerts data might have to go here, too
    }

    acc.push(providerDoc)

    return acc
  }, [])

  // Step 3: Insert docs into collection

  if (providersDocs.length) {
    return await db.collection(COLLECTION_NAME)
      .insertMany(
        providersDocs,
        { session }
      )
  }
}

module.exports = updateProvidersCollection
