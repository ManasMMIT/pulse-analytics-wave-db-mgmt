const customSelectNumberFilterFn = (filter, row, filterValue) => {
  const [colKey] = row
  if (filterValue === 'All') return filter
  filterValue = Number(filterValue)

  return filter.filter((datum) => datum.values[colKey] === filterValue)
}

export default customSelectNumberFilterFn
