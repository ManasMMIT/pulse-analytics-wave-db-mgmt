import axios from 'axios'

const updateVegaCommunityPracticeNetwork = (
  parent,
  { input: { id, ...body } },
  context,
  info
) => {
  return axios.patch(`community-practice-networks/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default updateVegaCommunityPracticeNetwork
