import axios from 'axios'

const deleteVegaInstitution = async (
  parent,
  { input: { id } },
  context,
  info
) => {
  const deletedVegaInstitution = await axios.get(`institutions/${id}/`)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await axios.delete(`institutions/${id}/`)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  return deletedVegaInstitution
}

export default deleteVegaInstitution
