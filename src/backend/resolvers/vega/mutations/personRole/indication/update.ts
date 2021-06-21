import axios from 'axios'

const updateVegaPersonRoleIndication = (
  parent,
  { input: { id, ...body } },
  context,
  info
) => {
  return axios.patch(`people-roles-indications/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default updateVegaPersonRoleIndication
