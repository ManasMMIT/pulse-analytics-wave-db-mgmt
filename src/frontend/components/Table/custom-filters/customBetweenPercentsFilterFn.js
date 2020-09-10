import _ from 'lodash'

const customBetweenPercentsFilterFn = (rows, columnIds, filterValue) => {
  const cleanFilterValue = filterValue.filter((v) => v !== undefined)
  if (_.isEmpty(cleanFilterValue)) return rows

  let [min, max] = filterValue

  if (!min) min = -1
  if (!max) max = 101

  const filteredRows = rows.filter((f) => {
    const roundedPercentage = Math.round(f.values[columnIds[0]] * 100)

    return roundedPercentage >= min && roundedPercentage <= max
  })

  return filteredRows
}

export default customBetweenPercentsFilterFn
