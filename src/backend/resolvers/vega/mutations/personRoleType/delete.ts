import axios from 'axios'

const deleteVegaPersonRoleType = async (
  parent,
  { input: { id } },
  context,
  info
) => {
  const deleteVegaPersonRoleType = await axios.get(`people-roles-types/${id}/`)
    .then(({ data }) => data)

  await axios.delete(`people-roles-types/${id}/`)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  return deleteVegaPersonRoleType
}

export default deleteVegaPersonRoleType
