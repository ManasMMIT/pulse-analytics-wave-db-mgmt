import axios from 'axios'

const updateVegaClientTeamRegion = (
  parent,
  { input: { id, ...body } },
  context,
  info
) => {
  return axios.patch(`teams-regions/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default updateVegaClientTeamRegion
