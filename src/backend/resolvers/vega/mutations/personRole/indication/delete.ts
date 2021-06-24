import axios from 'axios'

const deleteVegaPersonRoleIndication = async (
  parent,
  { input: { id } },
  { pulseDevDb },
  info
) => {
  const deletedVegaPersonRoleIndication = await axios.get(`people-roles-indications/${id}/`)
    .then(({ data }) => data)

  await axios.delete(`people-roles-indications/${id}/`)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await pulseDevDb.collection('marketBasketsSurveyAnswers').updateMany(
    { 'stakeholder.roleSpecialtyId': id },
    {
      $set: {
        'stakeholder.roleSpecialtyId': null,
        'stakeholder.roleSpecialty': null,
      }
    }
  )
  return deletedVegaPersonRoleIndication
}

export default deleteVegaPersonRoleIndication
