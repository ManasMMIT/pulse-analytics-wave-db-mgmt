import axios from 'axios'

const deleteVegaPersonRoleIndication = async (
  parent,
  { input: { id } },
  context,
  info
) => {
  const deletedVegaPersonRoleIndication = await axios.get(`people-roles-indications/${id}/`)
    .then(({ data }) => data)

  await axios.delete(`people-roles-indications/${id}/`)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  return deletedVegaPersonRoleIndication
}

export default deleteVegaPersonRoleIndication
