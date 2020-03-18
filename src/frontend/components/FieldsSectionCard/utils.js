import React from 'react'
import Select from 'react-select'
import FieldLabel from '../FieldLabel'

const INPUT_MAP = {
  'Select': Select,
}

const generateCardInput = field => {
  const { key, label, inputComponent, inputProps } = field
  const InputComponent = INPUT_MAP[inputComponent]

  return (
    <div key={`field-section-card-${ key }-input`}>
      <FieldLabel label={label}/>
      <InputComponent {...inputProps} />
    </div>
  )
}

export default generateCardInput