import axios from 'axios'

const deleteVegaPersonRoleType = async (
  parent,
  { input: { id } },
  { pulseDevDb },
  info
) => {
  const deleteVegaPersonRoleType = await axios.get(`people-roles-types/${id}/`)
    .then(({ data }) => data)

  await axios.delete(`people-roles-types/${id}/`)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await pulseDevDb.collection('marketBasketsSurveyAnswers').updateMany(
    { 'stakeholder.primaryRoleTypeId': id },
    {
      $set: {
        'stakeholder.primaryRoleTypeId': null,
        'stakeholder.primaryRoleType': null,
      }
    }
  )

  return deleteVegaPersonRoleType
}

export default deleteVegaPersonRoleType
