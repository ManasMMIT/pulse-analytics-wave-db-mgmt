import axios from 'axios'

const vegaPeopleRolesTypes = (parent, args, context, info) => {
  return axios.get('people-roles-types/')
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default vegaPeopleRolesTypes
