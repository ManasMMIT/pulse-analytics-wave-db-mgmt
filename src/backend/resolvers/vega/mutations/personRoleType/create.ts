import axios from 'axios'

const createVegaPersonRoleType = async (
  parent,
  { input },
  context,
  info
) => {
  return axios.post(`people-roles-types/`, input)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default createVegaPersonRoleType
