import axios from 'axios'

const obmServicesCategories = (parent, args, { pulseCoreDb }) => {
  return axios
    .get('obm-service-categories/')
    .then(({ data }) =>
      data.map(({ id: _id, ...datum }) => ({ _id, ...datum }))
    )
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

module.exports = obmServicesCategories
