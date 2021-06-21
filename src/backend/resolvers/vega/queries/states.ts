import axios from 'axios'

const vegaStates = (parent, args, context, info) => {
  return axios.get(`states/`)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default vegaStates
