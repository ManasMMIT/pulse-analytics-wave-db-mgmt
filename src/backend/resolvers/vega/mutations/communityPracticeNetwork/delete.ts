import axios from 'axios'

const deleteVegaCommunityPracticeNetwork = async (
  parent,
  { input: { id } },
  { pulseDevDb },
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

  await pulseDevDb.collection('marketBasketsSurveyAnswers')
    .updateMany(
      { 'stakeholder.providerCommunityPracticeNetwork._id': deletedVegaCommunityPracticeNetwork.id },
      { $set: { 'stakeholder.providerCommunityPracticeNetwork': null } },
    )
  return deletedVegaCommunityPracticeNetwork
}

export default deleteVegaCommunityPracticeNetwork
