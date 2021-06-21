import axios from 'axios'

const vegaInstitutions = (parent, args, context, info) => {
  return axios.get(`institutions/`)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default vegaInstitutions
