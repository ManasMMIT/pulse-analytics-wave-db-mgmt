import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import { mix } from 'polished'

import FontSpace from '../../utils/fontspace'
import Color from '../../utils/color'

const CARD_LABEL_STYLE = {
  textTransform: 'uppercase',
  letterspacing: 0.4,
  color: mix(0.4, Color.BLACK, Color.GRAY_LIGHT),
}

const Label = styled.div(
  {
    fontWeight: 700,
    ...FontSpace.FS2,
  },
  ({ style }) => style
)

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
