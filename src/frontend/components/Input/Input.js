import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'

import Color from '../../utils/color'
import Spacing from '../../utils/spacing'
import FontSpace from '../../utils/fontspace'

const InputComponent = styled.input({
  background: Color.WHITE,
  width: '100%',
  padding: `${Spacing.S3} ${Spacing.S4}`,
  borderRadius: 4,
  ...FontSpace.FS2,
})

const Input = ({ name, type, value, onChange }) => {
  const defaultValue = value || ''

  const onEventChange = event => {
    event.persist()
    const { type, name, value, checked } = event.target
    const stateVal = type === 'checkbox' ? checked : value

    onChange({ name, value: stateVal })
  }

  return (
    <InputComponent
      aria-labelledby={`field-${name}-label`}
      type={type}
      name={name}
      onChange={onEventChange}
      value={defaultValue}
    />
  )
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  type: PropTypes.string,
  onChange: PropTypes.func,
}

Input.defaultProps = {
  type: 'text',
  onChange: () => null,
  value: '',
}

export default Input
