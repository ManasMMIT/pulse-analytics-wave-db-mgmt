import axios from 'axios'

const createVegaClientTeamRegion = (
  parent,
  { input },
  context,
  info
) => {
  return axios.post(`teams-regions/`, input)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default createVegaClientTeamRegion
