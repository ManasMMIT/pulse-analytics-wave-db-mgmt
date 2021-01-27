const axios = require('axios')

const deleteObmServiceCategory = (parent, { input: { id } }, context, info) =>
  axios
    .delete(`obm-service-categories/${id}`)
    .then(() => ({ id }))
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

module.exports = deleteObmServiceCategory
