const sgClient = require('@sendgrid/client')
const sub = require('date-fns/sub')
const format = require('date-fns/format')
const _ = require('lodash')
const d3 = require('d3-collection')

const emailDeviceMetrics = async (parent, query, { pulseCoreDb }) => {
  sgClient.setApiKey(process.env.SENDGRID_API_KEY)
  const sixMonthsAgo = sub(new Date(), { months: 6 })
  const formattedDate = format(sixMonthsAgo, 'yyyy-MM-dd')
  const request = {
    method: 'GET',
    url: `/v3/devices/stats?start_date=${formattedDate}`,
  }

  const [res, body] = await sgClient.request(request).catch(err => {
    console.log(err)
  })

  const deviceMetricsByMonth = d3
    .nest()
    .key(({ date }) => {
      const splitDate = date.split('-')
      return `${splitDate[0]}-${splitDate[1]}`
    })
    .rollup(arr => {
      const flattenDeviceState = _.flatten(arr.map(({ stats }) => stats))
      const metricResults = flattenDeviceState.reduce(
        (acc, { name, metrics }) => {
          const { unique_opens } = metrics
          if (acc[name]) {
            acc[name] += unique_opens
          } else {
            acc[name] = unique_opens
          }
          return acc
        },
        {}
      )
      return metricResults
    })
    .object(body)
  return deviceMetricsByMonth
}

module.exports = emailDeviceMetrics
