const { ObjectId } = require('mongodb')
const isValidAlert = require('./isValidAlert')
const format = require('date-fns/format')

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

    // TODO: later consider storing alertDate across all pathways latest changes collections to date or time type rather than string below
    // But until then, keep the format consistent across all those collections.
    const alertFields = isValidAlert(connection.alert)
      ? { ...connection.alert, alertDate: format(new Date(connection.alert.alertDate), 'yyyy-MM-dd') }
      : {}

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
      utilization: connection.note,
      ...alertFields,
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
