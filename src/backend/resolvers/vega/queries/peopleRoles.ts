import axios from 'axios'

const vegaPeopleRoles = (parent, { indicationId }, context, info) => {
  return axios.get(`people-roles/?indication=${indicationId || ''}`)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default vegaPeopleRoles
