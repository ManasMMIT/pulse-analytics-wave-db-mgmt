import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'

import FontSpace from '../../utils/fontspace'
import Color from '../../utils/color'

const CARD_LABEL_STYLE = {
  textTransform: 'uppercase',
  color: Color.MEDIUM_GRAY_2,
}

const Label = styled.div({
    fontWeight: 700,
    ...FontSpace.FS2,
  }, ({ style }) => style)

const FieldLabel = ({ id, children, isCardLabel, labelStyle }) => {
  const style = isCardLabel
    ? { ...CARD_LABEL_STYLE, ...labelStyle }
    : labelStyle

  return (
    <Label id={id} style={style}>
      {children}
    </Label>
  )
}

FieldLabel.propTypes = {
  id: PropTypes.string,
  children: PropTypes.any.isRequired,
  isCardLabel: PropTypes.bool,
  labelStyle: PropTypes.object,
}

FieldLabel.defaultProps = {
  id: 'field-label',
  isCardLabel: false,
  labelStyle: {},
}

export default FieldLabel
