const customSelectFilterFn = (filter, row, filterValue) => {
  const [colKey] = row
  if (filterValue === 'All') return filter
  return filter.filter((datum) => datum.values[colKey] === filterValue)
}

export default customSelectFilterFn
