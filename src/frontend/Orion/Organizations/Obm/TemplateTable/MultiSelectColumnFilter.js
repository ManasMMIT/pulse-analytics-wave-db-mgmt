import React from 'react'
import Select from 'react-select'
import _ from 'lodash'

const MultiSelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  // Calculate the options for filtering
  // using the preFilteredRows
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

  const selectedOptions = !_.isEmpty(filterValue)
    ? filterValue.map((value) => ({
        value,
        label: value,
      }))
    : null

  // Render a multi-select box
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

        const options = _.isArray(option) ? option : [option]

        setFilter(options.map(({ value }) => value))

        return option
      }}
    />
  )
}

export default MultiSelectColumnFilter
