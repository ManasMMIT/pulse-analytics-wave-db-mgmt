import axios from 'axios'

const vegaCommunityPracticeNetworks = (parent, args, context, info) => {
  return axios.get(`community-practice-networks/`)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default vegaCommunityPracticeNetworks
