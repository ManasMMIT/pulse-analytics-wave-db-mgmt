const axios = require('axios')

const JOIN_obms_obmsServices = async (parent, { obmId }, context) => {
  let result = []

  if (obmId) {
    result = await axios
      .get(`obm-service-connections/?obm=${obmId}`)
      .then(({ data }) =>
        data.map(({ id, obm_id, obm_service_id, rating }) => ({
          id: id,
          obmId: obm_id,
          obmServiceId: obm_service_id,
          rating,
        }))
      )
      .catch((e) => {
        throw new Error(JSON.stringify(e.response.data))
      })
  }

  return result
}

module.exports = JOIN_obms_obmsServices
