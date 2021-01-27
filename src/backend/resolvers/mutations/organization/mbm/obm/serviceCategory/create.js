const axios = require('axios')

const createObmServiceCategory = async (parent, { input }, context, info) =>
  axios
    .post('obm-service-categories/', input)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

module.exports = createObmServiceCategory
