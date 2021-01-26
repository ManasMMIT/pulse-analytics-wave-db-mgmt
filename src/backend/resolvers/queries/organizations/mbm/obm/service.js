import axios from 'axios'

const obmServices = (parent, args, { pulseCoreDb }) => {
  return axios
    .get('obm-services/')
    .then(({ data }) =>
      data.map(({ id: _id, ...datum }) => ({ _id, ...datum }))
    )
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

module.exports = obmServices
