import axios from 'axios'

const vegaPeopleRolesIndications = (parent, { roleId, personId }, context, info) => {
  return axios.get(`people-roles-indications/?person_role=${roleId || ''}&person=${personId || ''}`)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default vegaPeopleRolesIndications
