const customMultiSelectFilterFn = (filter, row, filterValue) => {
  if (!filterValue) return filter

  const colKey = row[0]

  const filterValueArray = filterValue.split(', ')

  return filter.filter((rowDatum) => {
    return (
      rowDatum.values[colKey] === filterValue ||
      filterValueArray.includes(rowDatum.values[colKey])
    )
  })
}

export default customMultiSelectFilterFn
