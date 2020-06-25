import React from 'react'
import Select from 'react-select'
import _ from 'lodash'

const MultiSelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach((row) => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  const reactSelectOptions = options.map((option, i) => ({
    label: option,
    value: option,
  }))

  const selectedOptions =
    filterValue && filterValue.length
      ? filterValue.map((filterValue) => ({
          value: filterValue,
          label: filterValue,
        }))
      : null

  return (
    <Select
      isMulti
      value={selectedOptions}
      options={reactSelectOptions}
      onChange={(option) => {
        if (_.isEmpty(option)) {
          setFilter(undefined)
          return
        }

        let options = _.isArray(option) ? option : [option]
        options = options.map(({ value }) => value)
        setFilter(options)

        return option
      }}
    />
  )
}

export default MultiSelectColumnFilter
