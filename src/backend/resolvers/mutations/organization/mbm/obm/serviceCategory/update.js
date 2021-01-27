const axios = require('axios')

const updateObmServiceCategory = (
  parent,
  { input: { id, ...body } },
  context,
  info
) => {
  return axios
    .put(`obm-service-categories/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

module.exports = updateObmServiceCategory
