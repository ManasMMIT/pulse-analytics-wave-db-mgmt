import axios from 'axios'

const updateVegaProduct = (
  parent,
  { input: { id, ...body } },
  context,
  info
) => {
  return axios.patch(`products/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default updateVegaProduct
