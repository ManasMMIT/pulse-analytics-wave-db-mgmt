import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import { transparentize } from 'polished'

import Color from '../../utils/color'
import Spacing from '../../utils/spacing'
import FontSpace from '../../utils/fontspace'

const InputComponent = styled.input({
  background: Color.WHITE,
  width: '100%',
  padding: `${Spacing.S3}`,
  borderRadius: 4,
  ...FontSpace.FS2,
  border: `1px solid ${transparentize(0.96, Color.BLACK)}`,
  ':hover': {
    border: `1px solid ${transparentize(0.9, Color.BLACK)}`,
  },
  ':focus': {
    border: `1px solid ${transparentize(0.1, Color.PRIMARY)}`,
    outline: 'none',
  },
})

const Input = ({ name, type, value, onChange, disabled }) => {
  const defaultValue = value || ''
  let inputPropOverflow = {}
  if (type === 'number') inputPropOverflow.step = '0.1'

  const onEventChange = (event) => {
    event.persist()
    const { type, name, value, checked } = event.target

    let stateVal

    switch (type) {
      case 'checkbox':
        stateVal = checked
        break
      case 'number':
        stateVal = Number(value)
        break
      default:
        stateVal = value
        break
    }

    onChange({ name, value: stateVal })
  }

  return (
    <InputComponent
      aria-labelledby={`field-${name}-label`}
      {...inputPropOverflow}
      type={type}
      name={name}
      onChange={onEventChange}
      value={defaultValue}
      disabled={disabled}
    />
  )
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  type: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
}

Input.defaultProps = {
  type: 'text',
  onChange: () => null,
  value: '',
  disabled: false,
}

export default Input
