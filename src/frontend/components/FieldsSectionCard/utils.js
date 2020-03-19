import React from 'react'
import _ from 'lodash'
import Select from 'react-select'
import FieldLabel from '../FieldLabel'

const INPUT_MAP = {
  'Select': Select,
}

const generateCardInput = field => {
  if (_.isEmpty(field)) return null
  const { key, label, inputComponent, inputProps, removeCb } = field
  const InputComponent = INPUT_MAP[inputComponent]

  return (
    <div key={`field-section-card-${ key }-input`}>
      <FieldLabel removeCb={removeCb}>
        { label }
      </FieldLabel>
      <InputComponent {...inputProps} />
    </div>
  )
}

export default generateCardInput