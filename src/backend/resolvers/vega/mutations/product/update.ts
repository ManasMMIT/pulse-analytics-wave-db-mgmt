import axios from 'axios'

const updateVegaProduct = async (
  parent,
  { input: { id, ...body } },
  { pulseDevDb },
  info
) => {
  const updatedProduct = await axios.patch(`products/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await pulseDevDb.collection('marketBaskets').updateMany(
    { 'productsRegimens.product._id': id },
    {
      $set: {
        'productsRegimens.$[productRegimen].product.logoLink': updatedProduct.logo_link,
        'productsRegimens.$[productRegimen].product.color': updatedProduct.color,
      }
    },
    { arrayFilters: [{ 'productRegimen.product._id': id }] }
  )

  return updatedProduct
}

export default updateVegaProduct
