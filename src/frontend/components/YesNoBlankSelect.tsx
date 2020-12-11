import React from 'react'
import Select from 'react-select'

interface Option {
  label: string,
  value: any
}

const OPTIONS = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
  { label: ' ', value: null },
]

const YesNoNullSelect = (props: any) => {
  const { onChange, name, value, ...splatProps } = props

  const handleOnChange = (option: Option) => {
    onChange({ name, value: option.value })
  }

  let selectedOption = OPTIONS.find((option: Option) => option.value === value)
  if (selectedOption === undefined) selectedOption = OPTIONS[2]

  return (
    <Select
      options={OPTIONS}
      onChange={handleOnChange}
      value={selectedOption}
      {...splatProps}
    />
  )
}

export default YesNoNullSelect
