const sgClient = require('@sendgrid/client')
const sub = require('date-fns/sub')
const format = require('date-fns/format')
const _ = require('lodash')
const d3 = require('d3-collection')

const overviewMetrics = async (parent, query, { pulseCoreDb }) => {
  sgClient.setApiKey(process.env.SENDGRID_API_KEY)
  const sixMonthsAgo = sub(new Date(), { months: 6 })
  const formattedDate = format(sixMonthsAgo, 'yyyy-MM-dd')
  const request = {
    method: 'GET',
    url: `/v3/stats?aggregated_by=month&start_date=${formattedDate}`,
  }

  const [res, body] = await sgClient.request(request).catch(err => {
    console.log(err)
  })

  return body
}


module.exports = overviewMetrics
