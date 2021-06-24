import axios from 'axios'

const updateVegaPersonRoleType = async (
  parent,
  { input: { id, ...body } },
  { pulseDevDb },
  info
) => {
  const updatedPersonRoleType = await axios.patch(`people-roles-types/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await pulseDevDb.collection('marketBasketsSurveyAnswers').updateMany(
    { 'stakeholder.primaryRoleTypeId': id },
    {
      $set: {
        'stakeholder.primaryRoleType': updatedPersonRoleType.name,
      }
    }
  )

  return updatedPersonRoleType
}

export default updateVegaPersonRoleType
