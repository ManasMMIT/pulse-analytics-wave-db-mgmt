import axios from 'axios'

const updateVegaCommunityPracticeNetwork = async (
  parent,
  { input: { id, ...body } },
  { pulseDevDb },
  info
) => {
  const updatedCpn = await axios.patch(`community-practice-networks/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await pulseDevDb.collection('marketBasketsSurveyAnswers')
    .updateMany(
      { 'stakeholder.providerCommunityPracticeNetwork._id': updatedCpn.id },
      {
        $set: { 'stakeholder.providerCommunityPracticeNetwork.name': updatedCpn.name }
      },
    )

  return updatedCpn
}

export default updateVegaCommunityPracticeNetwork
