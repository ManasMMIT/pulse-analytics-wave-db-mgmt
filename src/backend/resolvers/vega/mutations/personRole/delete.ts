import axios from 'axios'

const deleteVegaPersonRole = async (
  parent,
  { input: { id } },
  { pulseDevDb },
  info
) => {
  const deleteVegaPersonRole = await axios.get(`people-roles/${id}/`)
    .then(({ data }) => data)

  await axios.delete(`people-roles/${id}/`)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await pulseDevDb.collection('marketBasketsSurveyAnswers').updateMany(
    { 'stakeholder.primaryRoleId': id },
    {
      $set: {
        'stakeholder.primaryRoleId': null,
        'stakeholder.primaryRole': null,
        'stakeholder.primaryRoleTypeId': null,
        'stakeholder.primaryRoleType': null,
        'stakeholder.roleSpecialtyId': null,
        'stakeholder.roleSpecialty': null,
      }
    }
  )

  return deleteVegaPersonRole
}

export default deleteVegaPersonRole
