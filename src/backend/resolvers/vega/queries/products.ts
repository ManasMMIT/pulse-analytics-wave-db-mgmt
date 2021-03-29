import axios from 'axios'

const vegaProducts = (parent, args, context, info) => {
  return axios.get('products').then(({ data }) => data)
}

export default vegaProducts
