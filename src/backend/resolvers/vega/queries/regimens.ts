import axios from 'axios'

const vegaRegimens = (parent, args, context, info) => {
  return axios.get('regimens').then(({ data }) => data)
}

export default vegaRegimens
