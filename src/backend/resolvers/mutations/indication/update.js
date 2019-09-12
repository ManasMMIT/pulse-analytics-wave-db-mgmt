const _ = 'lodash'
const { ObjectId } = require('mongodb')

const updateSourceIndication = async (
  parent,
  { input: { _id: indicationId, ...body } },
  { pulseCoreDb },
  info,
) => {
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

  let result = await pulseCoreDb.collection('indications').findOneAndUpdate(
    { _id: ObjectId(indicationId) },
    { $set: body },
    { returnOriginal: false },
  )

  result = result.value

  return result
}

module.exports = updateSourceIndication
