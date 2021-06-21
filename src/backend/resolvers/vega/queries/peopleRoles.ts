import axios from 'axios'

const vegaPeopleRoles = (parent, args, context, info) => {
  return axios.get(`people-roles/`)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default vegaPeopleRoles
