const _ = 'lodash'
const { ObjectId } = require('mongodb')

const updateSourceIndication = async (
  parent,
  { input: { _id: indicationId, ...body } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info,
) => {
  const _id = ObjectId(indicationId)

  if (body.regimens) { // TODO: shouldn't have to guard against this; every indication should have an regimens array
    const editedRegimens = body.regimens.map(({ _id: regimenId, name, products }) => {
      const newRegimenId = ObjectId(regimenId)

      const editedProducts = products.map(({ _id: productId, ...product }) => {
        const newProductId = ObjectId(productId)
        return { _id: newProductId, ...product }
      })

      return {
        _id: newRegimenId,
        name,
        products: editedProducts,
      }
    })

    body.regimens = editedRegimens
  }

  const session = mongoClient.startSession()

  let result
  await session.withTransaction(async () => {
    const { value: updatedIndication } = await pulseCoreDb
      .collection('indications')
      .findOneAndUpdate(
        { _id },
        { $set: body },
        { returnOriginal: false, session },
      )

    await pulseDevDb
      .collection('users.nodes.resources')
      .updateMany(
        { 'resources.treatmentPlans._id': _id },
        {
          $set: {
            'resources.$[resource].treatmentPlans.$[indication].name': updatedIndication.name
          }
        },
        {
          arrayFilters: [
            { 'resource.treatmentPlans': { $exists: true } },
            { 'indication._id': _id }
          ],
          session,
        }
      )
  
    result = updatedIndication
  })

  return result
}

module.exports = updateSourceIndication
