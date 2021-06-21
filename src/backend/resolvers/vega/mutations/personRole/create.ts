const axios = require('axios')

const createVegaPersonRole = async (
  parent,
  { input },
  context,
  info
) => {
  return await axios.post(`people-roles/`, input)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default createVegaPersonRole
