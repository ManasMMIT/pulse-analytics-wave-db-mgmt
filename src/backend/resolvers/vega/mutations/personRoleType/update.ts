import axios from 'axios'

const updateVegaPersonRoleType = async (
  parent,
  { input: { id, ...body } },
  context,
  info
) => {
  return axios.patch(`people-roles-types/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default updateVegaPersonRoleType
