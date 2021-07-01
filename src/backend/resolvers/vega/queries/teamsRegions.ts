import axios from 'axios'

const vegaClientTeamsRegions = (parent, { clientTeamId }, context, info) => {
  return axios.get(`teams-regions/?team=${clientTeamId || ''}`)
    .then(({ data }) => Array.isArray(data) ? data : [data])
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default vegaClientTeamsRegions
