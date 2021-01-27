const axios = require('axios')

const updateObmService = async (
  parent,
  { input: { id, ...body } },
  context,
  info
) =>
  axios
    .put(`obm-services/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

module.exports = updateObmService
