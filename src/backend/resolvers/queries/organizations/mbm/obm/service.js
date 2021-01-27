import axios from 'axios'

const obmServices = (parent, args, context) => {
  return axios
    .get('obm-services/')
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

module.exports = obmServices
