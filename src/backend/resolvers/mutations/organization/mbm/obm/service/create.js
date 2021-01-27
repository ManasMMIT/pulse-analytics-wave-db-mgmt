const axios = require('axios')

const createObmService = async (parent, { input }, { pulseCoreDb }, info) => {
  const { data } = await axios.post('obm-services/', input).catch((e) => {
    throw new Error(JSON.stringify(e.response.data))
  })

  return data
}

module.exports = createObmService
