import axios from 'axios'

const updateVegaPersonRole = async (
  parent,
  { input: { id, ...body } },
  { pulseDevDb },
  info
) => {
  const updatedRole = await axios.patch(`people-roles/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await pulseDevDb.collection('marketBasketsSurveyAnswers').updateMany(
    { 'stakeholder.primaryRoleId': id },
    {
      $set: {
        'stakeholder.primaryRole': updatedRole.name,
        'stakeholder.primaryRoleTypeId': updatedRole.type && updatedRole.type.id,
        'stakeholder.primaryRoleType': updatedRole.type && updatedRole.type.name,
      }
    }
  )

  return updatedRole
}

export default updateVegaPersonRole
