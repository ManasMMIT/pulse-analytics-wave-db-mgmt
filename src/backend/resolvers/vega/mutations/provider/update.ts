import axios from 'axios'

const updateVegaProvider = (
  parent,
  { input: { id, ...body } },
  context,
  info
) => {
  return axios.patch(`providers/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default updateVegaProvider
