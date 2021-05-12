import axios from 'axios'

const deleteMarketBasketCharacteristic = async (
  parent,
  { input: { id } },
  context,
  info
) => {
  const deletedCharacteristic = await axios.get(`market-basket-surveys-categories-characteristics/${id}/`)
    .then(({ data }) => data)

  await axios.delete(`market-basket-surveys-categories-characteristics/${id}/`).catch((e) => {
    throw new Error(JSON.stringify(e.response.data))
  })

  return deletedCharacteristic
}

export default deleteMarketBasketCharacteristic
