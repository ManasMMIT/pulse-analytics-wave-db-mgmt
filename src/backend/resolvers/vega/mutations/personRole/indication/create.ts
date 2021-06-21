import axios from 'axios'

const createVegaPersonRoleIndication = (
  parent,
  { input },
  context,
  info
) => {
  return axios.post(`people-roles-indications/`, input)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default createVegaPersonRoleIndication
