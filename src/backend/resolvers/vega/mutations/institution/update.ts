import axios from 'axios'

const updateVegaInstitution = (
  parent,
  { input: { id, ...body } },
  context,
  info
) => {
  return axios.patch(`institutions/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default updateVegaInstitution
