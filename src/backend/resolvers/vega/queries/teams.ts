import axios from 'axios'

const vegaClientTeams = (parent, { clientTeamId }, context, info) => {
  return axios.get(`teams/${clientTeamId || ''}`)
    .then(({ data }) => Array.isArray(data) ? data : [data])
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default vegaClientTeams
