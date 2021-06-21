import axios from 'axios'

const deleteVegaCommunityPracticeNetwork = async (
  parent,
  { input: { id } },
  context,
  info
) => {
  const deletedVegaCommunityPracticeNetwork = await axios.get(`community-practice-networks/${id}/`)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await axios.delete(`community-practice-networks/${id}/`)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  return deletedVegaCommunityPracticeNetwork
}

export default deleteVegaCommunityPracticeNetwork
