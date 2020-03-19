import React from 'react'
import styled from '@emotion/styled'

import FieldLabel from '../FieldLabel'

import Spacing from '../../utils/spacing'
import Color from '../../utils/color'

import generateCardInput from './utils'

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: Spacing.S4,
  background: Color.LIGHT_BLUE_GRAY_1,
  borderRadius: 4,
}, ({ style }) => style)

const FieldsSectionCard = ({
  label,
  fields,
  containerStyle,
}) => (
  <Wrapper style={containerStyle}>
    <FieldLabel isCardLabel>
        { label }
    </FieldLabel>
    { fields.map(generateCardInput) }
  </Wrapper>
)

export default FieldsSectionCard