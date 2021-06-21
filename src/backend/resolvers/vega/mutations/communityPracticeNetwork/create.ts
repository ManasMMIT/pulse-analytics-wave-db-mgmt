import axios from 'axios'

const createVegaCommunityPracticeNetwork = (
  parent,
  { input },
  context,
  info
) => {
  return axios.post(`community-practice-networks/`, input)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default createVegaCommunityPracticeNetwork
