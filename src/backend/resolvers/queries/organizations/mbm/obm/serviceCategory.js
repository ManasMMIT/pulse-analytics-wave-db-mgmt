import axios from 'axios'

const obmServicesCategories = async (parent, args, { pulseCoreDb }) =>
  axios
    .get('obm-service-categories/')
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

module.exports = obmServicesCategories
