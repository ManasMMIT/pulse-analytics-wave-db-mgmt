import axios from 'axios'

const deleteVegaPersonRole = async (
  parent,
  { input: { id } },
  context,
  info
) => {
  const deleteVegaPersonRole = await axios.get(`people-roles/${id}/`)
    .then(({ data }) => data)

  await axios.delete(`people-roles/${id}/`)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  return deleteVegaPersonRole
}

export default deleteVegaPersonRole
