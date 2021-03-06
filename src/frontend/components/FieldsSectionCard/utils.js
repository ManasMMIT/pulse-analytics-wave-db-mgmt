import React from 'react'
import Select from 'react-select'
import FieldLabel from '../FieldLabel'
import Input from '../Input'
import YesNoBlankSelect from '../YesNoBlankSelect'

export const INPUT_MAP = {
  Select,
  MultiSelect: Select,
  YesNoBlankSelect: YesNoBlankSelect,
  TextInput: Input,
  DateInput: Input,
  EmailInput: Input,
  NumberInput: Input,
  RangeInput: Input,
  TimeInput: Input,
  CheckboxInput: Input,
}

const generateCardInput = ({ field, fieldLabelStyle, fieldStyle }) => {
  const { key, label, inputComponent, inputProps } = field

  const InputComponent = INPUT_MAP[inputComponent]
  if (!InputComponent) return null
  if (inputComponent === 'MultiSelect') inputProps.isMulti = true

  return (
    <div key={`field-section-card-${key}-${label}-input`} style={fieldStyle}>
      <FieldLabel id={`field-${key}-label`} labelStyle={fieldLabelStyle}>
        {label}
      </FieldLabel>
      <InputComponent {...inputProps} />
      {/* THE BELOW IS HAPPENING FOR REACT-SELECT; THE TYPE DOES NOTHING; SHOULD IT? */}
      {/* <Select type="string" /> */}
      {/* <Select type="number" /> */}
    </div>
  )
}

export default generateCardInput
