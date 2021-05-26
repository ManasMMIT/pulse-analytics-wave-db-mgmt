import axios from 'axios'

const vegaPeople = (parent, args, context, info) => {
  return axios.get('people/').then(({ data }) => data)
}

export default vegaPeople
