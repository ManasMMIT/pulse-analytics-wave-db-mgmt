const axios = require('axios')

// ! ASSUMPTION: this resolver is for connecting a SINGLE OBM to many services
const connectObmAndObmService = async (
  parent,
  { input: { connections, obmId } },
  context,
  info
) => {
  await axios.delete(`obms/${obmId}/delete_service_connections/`).catch((e) => {
    throw new Error(JSON.stringify(e.response.data))
  })

  for (const connection of connections) {
    const vegaInput = {
      id: connection.id,
      obm_id: connection.obmId,
      obm_service_id: connection.obmServiceId,
      rating: connection.rating,
    }

    await axios.post('obm-service-connections/', vegaInput).catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
  }

  return connections
}

module.exports = connectObmAndObmService
