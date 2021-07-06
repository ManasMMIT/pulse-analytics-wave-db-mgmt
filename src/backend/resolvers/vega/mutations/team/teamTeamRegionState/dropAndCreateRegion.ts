import axios from 'axios'

const dropAndCreateRegion = async (
  parent,
  { team_id, team_region_id, teams_teams_regions_states },
  context,
  info
) => {
  await axios.delete(`teams-teams-regions-states/drop_team_region/?team_region=${team_region_id}`)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await axios.post(`teams-teams-regions-states/create_team_region/`, teams_teams_regions_states)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  return await axios.get(`teams-teams-regions-states/create_team_region/?team=${team_id}`)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default dropAndCreateRegion
