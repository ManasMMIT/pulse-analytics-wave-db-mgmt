import axios from 'axios'

const updateVegaPersonRoleIndication = async (
  parent,
  { input: { id, ...body } },
  { pulseDevDb },
  info
) => {
  const updatedRoleSpecialty = await axios.patch(`people-roles-indications/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await pulseDevDb.collection('marketBasketsSurveyAnswers').updateMany(
    { 'stakeholder.roleSpecialtyId': id },
    {
      $set: {
        'stakeholder.roleSpecialty': updatedRoleSpecialty.specialty_label,
      }
    }
  )

  return updatedRoleSpecialty
}

export default updateVegaPersonRoleIndication
