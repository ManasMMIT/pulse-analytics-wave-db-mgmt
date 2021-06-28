import axios from 'axios'

const deleteVegaInstitution = async (
  parent,
  { input: { id } },
  { pulseDevDb },
  info
) => {
  const deletedVegaInstitution = await axios.get(`institutions/${id}/`)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await axios.delete(`institutions/${id}/`)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await pulseDevDb.collection('marketBasketsSurveyAnswers')
    .updateMany(
      { 'stakeholder.providerInstitutions._id': deletedVegaInstitution.id },
      { $pull: { 'stakeholder.providerInstitutions': { _id: deletedVegaInstitution.id } } },
    )

  return deletedVegaInstitution
}

export default deleteVegaInstitution
