import axios from 'axios'

const createVegaInstitution = (
  parent,
  { input },
  context,
  info
) => {
  return axios.post(`institutions/`, input)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default createVegaInstitution
