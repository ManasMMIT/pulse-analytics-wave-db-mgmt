import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'

import FieldLabel from '../FieldLabel'

import Spacing from '../../utils/spacing'
import Color from '../../utils/color'

import generateCardInput from './utils'

const Wrapper = styled.div(
  {
    display: 'flex',
    flexDirection: 'column',
    padding: Spacing.S4,
    background: Color.GRAY_LIGHT,
    borderRadius: 4,
  },
  ({ style }) => style
)

const FieldsSectionCard = ({
  label,
  fields,
  containerStyle,
  sectionLabelStyle,
  fieldLabelStyle,
  fieldStyle,
  fieldsContainerStyle,
}) => (
  <Wrapper style={containerStyle}>
    <FieldLabel isCardLabel labelStyle={sectionLabelStyle}>
      {label}
    </FieldLabel>
    <div style={fieldsContainerStyle}>
      {fields.map((field) =>
        generateCardInput({ field, fieldLabelStyle, fieldStyle })
      )}
    </div>
  </Wrapper>
)

FieldsSectionCard.propTypes = {
  label: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string,
      inputComponent: PropTypes.string,
      inputProps: PropTypes.object,
    })
  ),
  containerStyle: PropTypes.object,
  sectionLabelStyle: PropTypes.object,
  fieldLabelStyle: PropTypes.object,
  fieldStyle: PropTypes.object,
  fieldsContainerStyle: PropTypes.object,
}

FieldsSectionCard.defaultProps = {
  fields: [],
  containerStyle: {},
  sectionLabelStyle: {},
  fieldLabelStyle: {},
  fieldStyle: {},
  fieldsContainerStyle: {},
}

export default FieldsSectionCard
