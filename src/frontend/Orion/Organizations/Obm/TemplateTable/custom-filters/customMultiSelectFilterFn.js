import _ from 'lodash'

const customMultiSelectFilterFn = (filter, row, filterValue) => {
  if (_.isEmpty(filterValue)) return filter
  const colKey = row[0]

  return filter.filter((rowDatum) => {
    const rowValue = rowDatum.values[colKey]
    return filterValue.includes(rowValue)
  })
}

export default customMultiSelectFilterFn
