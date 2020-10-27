import React from 'react'
import Select from 'react-select'
import _ from 'lodash'
import { customTableSelectStyles } from './customTableSelectStyles'

const getCoercedLabel = (label) => {
  if (Array.isArray(label)) return label.join(', ')

  if ([true, false].includes(label)) return String(label)

  return label
}

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
    label: getCoercedLabel(option),
    value: option,
  }))

  const selectedOptions = !_.isEmpty(filterValue)
    ? filterValue.map((value) => ({
        value,
        label: getCoercedLabel(value),
      }))
    : null

  // Render a multi-select box
  return (
    <Select
      isMulti
      value={selectedOptions}
      options={reactSelectOptions}
      styles={customTableSelectStyles}
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
