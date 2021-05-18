const axios = require('axios')
const { zonedTimeToUtc } = require('date-fns-tz')

const DEFAULT_TIMEZONE = require('../../../../utils/states-data-util')

const createMarketBasketSurvey = async (
  parent,
  { input },
  context,
  info
) => {
  const { date, ...rest } = input
  const standardizedDate = zonedTimeToUtc(date, DEFAULT_TIMEZONE)
  input = { date: standardizedDate, ...rest }
  
  return await axios.post('market-basket-surveys/', input)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default createMarketBasketSurvey
