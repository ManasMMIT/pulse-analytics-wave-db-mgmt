const axios = require('axios')

const deleteObmService = async (parent, { input: { id } }, context, info) => {
  return axios
    .delete(`obm-services/${id}`)
    .then(() => ({ id }))
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}
module.exports = deleteObmService
