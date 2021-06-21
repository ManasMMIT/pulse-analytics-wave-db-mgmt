import axios from 'axios'

const updateVegaPersonRole = async (
  parent,
  { input: { id, ...body } },
  context,
  info
) => {
  return axios.patch(`people-roles/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default updateVegaPersonRole
