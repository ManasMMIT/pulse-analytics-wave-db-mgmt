const axios = require('axios')

const createObmService = async (parent, { input }, { pulseCoreDb }, info) => {
  const { data } = await axios
    .post('obm-services/', { ...input, id: input._id })
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  return data
}

module.exports = createObmService
