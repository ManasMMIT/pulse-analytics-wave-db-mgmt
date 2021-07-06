import axios from 'axios'

const teamsTeamsRegionsStates = (parent, { clientTeamId }, context, info) => {
  const queryUrl = `teams-teams-regions-states/?team=${clientTeamId || ''}`

  return axios.get(queryUrl)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default teamsTeamsRegionsStates
