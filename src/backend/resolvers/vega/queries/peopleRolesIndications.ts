import axios from 'axios'

const vegaPeopleRolesIndications = (parent, args, context, info) => {
  return axios.get('people-roles-indications/')
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default vegaPeopleRolesIndications
