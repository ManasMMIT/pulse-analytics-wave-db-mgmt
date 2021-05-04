const { ObjectId } = require('mongodb')
const _ = require('lodash')
const axios = require('axios')

const updateSourceRegimen = async (
  parent,
  { input: { _id: regimenId, products, name } },
  { mongoClient, pulseCoreDb, pulseDevDb },
  info
) => {
  if (_.isEmpty(products)) throw Error(`'products' field can't be empty`)

  let formattedProducts = products.map((product) => ({
    ...product,
    _id: ObjectId(product._id),
  }))

  const _id = ObjectId(regimenId)

  let result

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // ! Vega OP
    await updateVegaRegimen(_id, { name, products }, pulseCoreDb)

    // ! Mongo OP
    result = await pulseCoreDb
      .collection('regimens')
      .findOneAndUpdate(
        { _id },
        { $set: { name, products: formattedProducts } },
        { session, returnOriginal: false }
      )

    result = result.value

    // update the regimen for all indications in the indications collection
    await pulseCoreDb.collection('indications').updateMany(
      { regimens: { $elemMatch: { _id } } },
      {
        $set: {
          'regimens.$': {
            _id,
            name,
            products: formattedProducts,
          },
        },
      }, // only need to update the 1st match in regimens array because they're unique
      { session }
    )
  })

  await pulseDevDb.collection('users.nodes.resources').updateMany(
    { 'resources.treatmentPlans.regimens._id': _id },
    {
      $set: {
        'resources.$[resource].treatmentPlans.$[treatmentPlan].regimens.$[regimen].name': name,
      },
    },
    {
      arrayFilters: [
        { 'resource.treatmentPlans': { $exists: true } },
        { 'treatmentPlan.regimens': { $exists: true } },
        { 'regimen._id': _id },
      ],
      session,
    }
  )

  return result
}

// ! Don't trust frontend input for regimen uuid or actual product data
async function updateVegaRegimen(_id, { name, products }, pulseCoreDb) {
  const { uuid } = await pulseCoreDb.collection('regimens').findOne({ _id })

  // should always be true after seeding vega
  if (uuid) {
    let vegaProducts = await getVegaProducts(products, pulseCoreDb)

    const vegaInput = {
      name,
      product_set: vegaProducts,
    }

    await axios.patch(`regimens/${uuid}/`, vegaInput).catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
  }
}

async function getVegaProducts(products, pulseCoreDb) {
  const productIds = products.map(({ _id }) => ObjectId(_id))
  // ! nested products sent to this resolver are copies w/o seeded uuids
  // ! need to lookup in source products collection
  const sourceProducts = await pulseCoreDb
    .collection('products')
    .find({ _id: { $in: productIds } })
    .toArray()

  return sourceProducts.reduce((acc, { uuid }) => {
    if (uuid) return [...acc, uuid]
    return acc
  }, [])
}

module.exports = updateSourceRegimen
