import axios from 'axios'

const deleteVegaClientTeamRegion = async (
  parent,
  { input: { id } },
  context,
  info
) => {
  const deletedVegaClientTeamRegion = await axios.get(`teams-regions/${id}/`)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await axios.delete(`teams-regions/${id}/`)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  return deletedVegaClientTeamRegion
}

export default deleteVegaClientTeamRegion
