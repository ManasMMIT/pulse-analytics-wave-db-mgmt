const axios = require('axios')

const createMarketBasketCategory = async (
  parent,
  { input },
  { pulseDevDb },
  info
) => {
  const vegaInput = {
    ...input,
    characteristics: [],
  }

  const createdMarketBasketCategory = await axios.post('market-basket-surveys-categories/', vegaInput)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await pulseDevDb.collection('marketBaskets').updateOne(
    { '_id': createdMarketBasketCategory.market_basket },
    {
      $push: {
        'categories': {
          '_id': createdMarketBasketCategory.id,
          'name': createdMarketBasketCategory.name,
          'prompt': createdMarketBasketCategory.prompt,
          'characteristics': [],
        },
      },
    }
  )

  return createdMarketBasketCategory
}

export default createMarketBasketCategory
