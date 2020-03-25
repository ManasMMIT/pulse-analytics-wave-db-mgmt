import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'

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
  sectionLabelStyle,
  fieldLabelStyle,
  fieldStyle,
}) => (
  <Wrapper style={containerStyle}>
    <FieldLabel isCardLabel labelStyle={sectionLabelStyle}>
      {label}
    </FieldLabel>
    {fields.map(field =>
      generateCardInput({ field, fieldLabelStyle, fieldStyle })
    )}
  </Wrapper>
)

FieldsSectionCard.propTypes = {
  label: PropTypes.string.isRequired,
  fields: PropTypes.array,
  containerStyle: PropTypes.object,
  sectionLabelStyle: PropTypes.object,
  fieldLabelStyle: PropTypes.object,
  fieldStyle: PropTypes.object,
}

FieldsSectionCard.defaultProps = {
  fields: [],
  containerStyle: {},
  sectionLabelStyle: {},
  fieldLabelStyle: {},
  fieldStyle: {},
}

export default FieldsSectionCard
