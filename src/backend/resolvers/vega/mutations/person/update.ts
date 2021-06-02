import axios from 'axios'

const updateVegaPerson = async (
  parent,
  { input: { id, ...body } },
  context,
  info
) => {
  return await axios.patch(`people/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default updateVegaPerson
