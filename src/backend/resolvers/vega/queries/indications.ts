import axios from 'axios'

const vegaIndications = (parent, args, context, info) => {
  return axios.get('indications/')
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default vegaIndications
