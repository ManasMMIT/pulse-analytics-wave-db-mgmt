import React from 'react'
import styled from '@emotion/styled'

import FieldLabel from '../FieldLabel'

import Spacing from '../../utils/spacing'
import Color from '../../utils/color'

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: Spacing.S4,
  background: Color.LIGHT_BLUE_GRAY_1,
  borderRadius: 4,
}, ({ style }) => style)

const FieldsSectionCard = ({
  data,
  inputs = {},
  containerStyle,
}) => {
  const { name, fields } = data

  return (
    <Wrapper style={containerStyle}>
      <FieldLabel label={name} isCardLabel />
      {
        fields.map(field => {
          const { key, label } = field
          const Input = inputs[key] || null

          return (
            <div>
              <FieldLabel label={label}/>
              { Input }
            </div>
          )
        })
      }
    </Wrapper>
  )
}

export default FieldsSectionCard