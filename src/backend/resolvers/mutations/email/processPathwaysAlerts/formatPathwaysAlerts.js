const _ = require('lodash')
const d3 = require('d3-collection')

const dateSort = (
  { alertDate: alertDateA },
  { alertDate: alertDateB }
) => {
  const dateB = new Date(alertDateB).valueOf()
  const dateA = new Date(alertDateA).valueOf()

  return dateB - dateA
}

module.exports = alerts => {
  // Sort at organization level by oncologistPercent
  const sortedAlerts = Object.values(alerts).sort(
    (a, b) => b.oncologistPercent - a.oncologistPercent
  )

  const formattedAlerts = d3
    .nest()
    .key(d => d.organization)
    .key(d => _.camelCase(d.alertType))
    .sortValues(dateSort)
    .rollup(arr => {
      const { alertType } = arr[0]
      const isPositioning = alertType === 'Positioning'

      if (!isPositioning) return arr

      // Additional group and sort by 'indication' for Positioning alerts only
      const sortedData = _.sortBy(arr, ['indication'])

      return _.groupBy(sortedData, 'indication')
    })
    .object(sortedAlerts)

  return formattedAlerts
}
