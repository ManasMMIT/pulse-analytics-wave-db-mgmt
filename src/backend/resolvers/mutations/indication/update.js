const _ = 'lodash'
const { ObjectId } = require('mongodb')

const updateSourceIndication = async (
  parent,
  { input: { _id, ...body } },
  { pulseCoreDb },
  info,
) => {
  if (body.regimens) {
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
    { _id: ObjectId(_id) },
    { $set: body },
    { returnOriginal: false },
  )

  result = result.value

  return result
}

module.exports = updateSourceIndication
