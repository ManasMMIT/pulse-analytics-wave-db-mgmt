import axios from 'axios'

const updateVegaInstitution = async (
  parent,
  { input: { id, ...body } },
  { pulseDevDb },
  info
) => {
  const updatedInstitution = await axios.patch(`institutions/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await pulseDevDb.collection('marketBasketsSurveyAnswers')
    .updateMany(
      { 'stakeholder.providerInstitutions._id': updatedInstitution.id },
      {
        $set: {
          'stakeholder.providerInstitutions.$[providerInstitution].name': updatedInstitution.name,
        }
      },
      { arrayFilters: [{ 'providerInstitution._id': updatedInstitution.id }] }
    )

  return updatedInstitution
}

export default updateVegaInstitution
