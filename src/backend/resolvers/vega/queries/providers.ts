import axios from 'axios'

const vegaProviders = (parent, args, context, info) => {
  return axios.get(`providers/`)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default vegaProviders
