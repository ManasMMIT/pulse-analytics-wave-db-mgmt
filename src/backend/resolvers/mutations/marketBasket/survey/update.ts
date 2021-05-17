const axios = require('axios')
const { zonedTimeToUtc } = require('date-fns-tz')

const DEFAULT_TIMEZONE = require('../../../../utils/states-data-util')

const updateMarketBasketSurvey = async (
  parent,
  { input: { id, ...body } },
  context,
  info
) => {
  const { date, ...rest } = body
  const standardizedDate = zonedTimeToUtc(date, DEFAULT_TIMEZONE)
  body = { date: standardizedDate, ...rest }

  return await axios.patch(`market-basket-surveys/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default updateMarketBasketSurvey
